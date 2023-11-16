const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const glob = require('glob');
const HraMarkdownParser = require('./md-parser.js').HraMarkdownParser;
const MarkdownIt = require('markdown-it');

const VERSION = 'v1.4';

const md = new MarkdownIt();

const TERMS_ENDPOINT = 'http://grlc.io/api-git/hubmapconsortium/ccf-grlc/subdir/hra-scratch//get-glb-nodes';

const GLB_FIXES = {
  'https://cdn.humanatlas.io/hra-releases/v1.4/models/3d-vh-f-united.glb.7z':
    'https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.4/assets/3d-vh-f-united.glb',
  'https://cdn.humanatlas.io/hra-releases/v1.4/models/3d-vh-m-united.glb.zip':
    'https://cdn.humanatlas.io/digital-objects/ref-organ/united-male/v1.4/assets/3d-vh-m-united.glb',
};

async function fetchTerms() {
  return fetch(TERMS_ENDPOINT, { headers: { Accept: 'text/csv' } })
    .then((r) => r.text())
    .then((csv) => Papa.parse(csv, { header: true, skipEmptyLines: true }))
    .then((r) => r.data);
}

function getOrgan(parser) {
  return parser
    .getName()
    .replace(/\-female|\-male|\-left|\-right/g, '')
    .replace('united', 'body');
}

function mdToHtml(markdown) {
  return md.render(markdown).trim().slice(3, -4);
}

function getGlbLink(mdLink) {
  const link = mdLink.slice(mdLink.lastIndexOf('(') + 1, mdLink.lastIndexOf(')'));
  return GLB_FIXES[link] || link;
}

async function main() {
  const refOrgans = glob
    .sync(`../${VERSION}/markdown/ref-organs/3d-*.md`)
    .map((m) => new HraMarkdownParser(m))
    .map((m) => [m, m.toJson()]);

  const terms = (await fetchTerms()).reduce((acc, row) => {
    const glb_file = row.glb_url.split('/').slice(-1)[0];
    const obj = (acc[glb_file] = acc[glb_file] || {
      glb_url: row.glb_url,
      terms: {},
    });
    obj.terms[row.node_id] = {
      node_id: row.node_id,
      node_iri: row.node_iri,
      node_label: row.node_label,
    };
    return acc;
  }, {});

  for (const term of Object.values(terms)) {
    term.node_ids = Object.values(term.terms)
      .map((t) => t.node_id)
      .join('|');
    term.node_iris = Object.values(term.terms)
      .map((t) => t.node_iri)
      .join('|');
    term.node_labels = Object.values(term.terms)
      .map((t) => t.node_label)
      .join('|');
  }

  function enrichModel([_parser, m]) {
    const link = getGlbLink(m.dataTable);
    const file = link.split('/').slice(-1)[0].replace('.zip', '').replace('.7z', '');
    const term = terms[file];
    if (term) {
      m.node_ids = term.node_ids;
      m.node_iris = term.node_iris;
      m.node_labels = term.node_labels;
    }
  }

  refOrgans.forEach(enrichModel);

  const nih3d = refOrgans.map(([parser, m]) => ({
    purl: `https://purl.humanatlas.io/ref-organ/${parser.getName()}/${parser.getVersion()}`,
    // 'File Label': `https://purl.humanatlas.io/ref-organ/${m.name}/${m.version}`,
    // 'File Label': getGlbLink(m.dataTable).split('/').slice(-1)[0],
    'File Label': `hra-reference-organ-${parser.getName()}-${parser.getVersion()}.glb`,
    glb_file: getGlbLink(m.dataTable),
    term_ids: m.node_ids || '',
    // term_iris: m.node_iris || '',
    // term_labels: m.node_labels || '',
    '3D Modeling Software': 'Maya',
    // 'Admin Tags': 'HRA',
    'Attribution Instructions': mdToHtml(m.citation),
    Category: 'Anatomy',
    Collection: 'Human Reference Atlas 3D Reference Object Library',
    Description: mdToHtml(m.description),
    // 'Diagnostic Code': '',
    // 'Experimental Method': '',
    // 'FILE: Contour Level': '',
    // 'FILE: Is Optimized for 3D Printing': '',
    // 'FILE: Make Raw Data Available': '',
    // 'FILE: Pixel Spacing': '',
    // 'FILE: Polygons': '',
    // 'FILE: Vertex Color': '',
    // 'FILE: Vertices': '',
    // 'FILE: Voxel Dimensions': '',
    // 'Imaging Modality': '',
    // 'Institutional Affiliation': '',
    'Is this Human Data?': 'Yes',
    Keywords: `HRA|Human Reference Atlas|human|organ|${getOrgan(parser)}`,
    License: 'CC BY', // mdToHtml(m.license),
    // 'Medical Application': '',
    // 'NIH 3D Contributors': '',
    // 'Radiation Dose': '',
    // 'Segmentation Software': '',
    // 'Supplementary Files: 3D Mesh and Material Files': '',
    // 'Supplementary Files: Documentation Files': '',
    // 'Supplementary Files: Image Files': '',
    // 'Supplementary Files: Medical Imaging File(s)': '',
    // 'Supplementary Files: Scientific Data Files': '',
    // 'This is a Remix from this External Source': '',
    // 'This is a Remix of NIH 3D Entry': '',
    Title: mdToHtml(m.title)
      .replace('3D Reference Organ for ', '')
      .replace('3D Reference Organ Set for United', 'Body')
      .replace('3D Reference organ for ', ''),
    // 'Use of Anatomical Model': '',
    // 'PubMed ID': '',
    // 'Entry Metadata': '',
    // 'Submission Date': '',
    // 'Publication Date': m.creation_date,
    'Username/Content Owner': 'katy@iu.edu',
  }));

  fs.writeFileSync('../scratch/hra-v1.4.nih3d-metadata.csv', Papa.unparse(nih3d));
}
main();

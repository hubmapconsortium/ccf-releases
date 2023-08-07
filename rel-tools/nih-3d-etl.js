const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const glob = require('glob');
const MarkdownIt = require('markdown-it');

const VERSION = 'v1.4';

const md = new MarkdownIt();

const TERMS_ENDPOINT = 'http://grlc.io/api-git/hubmapconsortium/ccf-grlc/subdir/hra-scratch//get-glb-nodes';

async function fetchTerms() {
  return fetch(TERMS_ENDPOINT, { headers: { 'Accept': 'text/csv' } }).then(r => r.text()).then(csv => Papa.parse(csv, { header: true, skipEmptyLines: true })).then(r => r.data);
}

function mdToHtml(markdown) {
  return md.render(markdown).trim().slice(3, -4);
}

function getGlbLink(mdLink) {
  const link = mdLink.slice(mdLink.lastIndexOf('(') + 1, mdLink.lastIndexOf(')'));
  return link;
}

class HraMarkdownParser {
  constructor(inputFile) {
    this.inputFile = inputFile;
    this.rawMd = fs
      .readFileSync(inputFile)
      .toString()
      .replace(/\&ouml\;/g, 'ö')
      .trim()
      .split('\n');
  }

  hasKey(key) {
    return !!this.rawMd.find((l) => l.includes(`**${key}:**`));
  }
  getMetadata(key) {
    if (!this.hasKey(key)) {
      return '';
    }
    return this.rawMd
      .find((l) => l.includes(`**${key}:**`))
      .split('|')[2]
      .trim();
  }
  getMultiValue(key) {
    return this.getMetadata(key)
      .replace('&ouml;', 'ö')
      .split(/[\;\,]\ */g)
      .map((n) => n.trim());
  }
  getAccessedDate(dateStr) {
    const [_dayOfWeek, month, day, year] = new Date(dateStr)
      .toDateString()
      .split(' ');
    return `${month} ${parseInt(day, 10)}, ${year}`;
  }
  getAuthors(nameKey, orcidKey) {
    if (!this.hasKey(nameKey) || !this.hasKey(orcidKey)) {
      return [];
    }
    const names = this.getMultiValue(nameKey);
    const orcids = this.getMultiValue(orcidKey).map((n) =>
      n.slice(n.indexOf('[') + 1, n.indexOf(']')).trim()
    );
    return names.map((fullName, index) => ({
      fullName,
      firstName: fullName.split(/\ +/g).slice(0)[0],
      lastName: fullName.replace(/\ II$/g, '').split(/\ +/g).slice(-1)[0],
      orcid: orcids[index],
    }));
  }
  getFunders(funderKey, awardKey) {
    const funders = this.getMultiValue(funderKey);
    const awards = this.getMultiValue(awardKey);

    return funders.map((funder, index) => ({
      funder,
      awardNumber: awards[index],
    }));
  }

  getName() {
    return path
      .basename(this.inputFile, '.md')
      .replace(this.getDoType() + '-', '')
      .replace(/^vh\-/, '')
      .replace(/^3d\-/, '');
  }
  getTitle() {
    return this.rawMd[0]
      .slice(1)
      .trim()
      .split(' ')
      .slice(0, -1)
      .join(' ')
      .trim()
      .replace(/,$/, '');
  }
  getVersion() {
    return this.rawMd[0].slice(1).trim().split(' ').slice(-1)[0];
  }
  getDescription() {
    return this.rawMd[
      this.rawMd.findIndex((n) => n.startsWith('### Description')) + 1
    ].trim();
  }
  getHowToCiteKey() {
    return this.rawMd
      .find((l) => l.includes('**How to Cite') && !l.includes('Overall:**'))
      .split('|')[1]
      .trim()
      .replace(/\*/g, '')
      .replace(/\:/g, '');
  }
  getHowToCiteOverallKey() {
    return this.rawMd
      .find((l) => l.includes('**How to Cite') && l.includes('Overall:**'))
      .split('|')[1]
      .trim()
      .replace(/\*/g, '')
      .replace(/\:/g, '');
  }

  getDoType() {
    return this.inputFile
      .split('/')
      .slice(-2)[0]
      .replace('ref-organs', 'ref-organ');
  }

  toJson() {
    return {
      type: this.getDoType(),
      name: this.getName(),
      version: this.getVersion(),
      title: this.getTitle(),
      description: this.getDescription(),

      creators: [
        ...this.getAuthors('Creator(s)', 'Creator ORCID(s)'),
        ...this.getAuthors('Creator(s)', 'Creator ORCID'),
      ],
      project_leads: this.getAuthors('Project Lead', 'Project Lead ORCID'),
      reviewers: [
        ...this.getAuthors('Reviewer(s)', 'Reviewers ORCID(s)'),
        ...this.getAuthors('Reviewer(s)', 'Reviewer ORCID(s)'),
        ...this.getAuthors(
          'Internal Reviewer(s)',
          'Internal Reviewer ORCID(s)'
        ),
      ],
      externalReviewers: this.getAuthors(
        'External Reviewer(s)',
        'External Reviewer ORCID(s)'
      ),

      creation_date:
        this.getMetadata('Creation Date') || this.getMetadata('Date'),
      creation_year: (
        this.getMetadata('Creation Date') || this.getMetadata('Date')
      ).split('-')[0],
      accessed_date: this.getAccessedDate(
        this.getMetadata('Creation Date') || this.getMetadata('Date')
      ),

      license: this.getMetadata('License'),
      publisher: this.getMetadata('Publisher'),
      funders: this.getFunders('Funder', 'Award Number'),
      hubmapId: this.getMetadata('HuBMAP ID'),
      dataTable:
        this.getMetadata('Data Table') ||
        this.getMetadata('3D Data') ||
        this.getMetadata('2D Data'),
      doi: this.getMetadata('DOI').split('[')[1].split(']')[0],
      citation: this.getMetadata(this.getHowToCiteKey()),
      citationOverall: this.getMetadata(this.getHowToCiteOverallKey()),
    };
  }
}

async function main() {
  const refOrgans = glob
    .sync(`../${VERSION}/markdown/ref-organs/3d-*.md`)
    .map((m) => new HraMarkdownParser(m).toJson());

  const terms = (await fetchTerms()).reduce((acc, row) => {
    const glb_file = row.glb_url.split('/').slice(-1)[0];
    const obj = acc[glb_file] = acc[glb_file] || {
      glb_url: row.glb_url,
      terms: {}
    };
    obj.terms[row.node_id] = {
      node_id: row.node_id,
      node_iri: row.node_iri,
      node_label: row.node_label
    };
    return acc;
  }, {});

  for (const term of Object.values(terms)) {
    term.node_ids = Object.values(term.terms).map(t => t.node_id).join('|');
    term.node_iris = Object.values(term.terms).map(t => t.node_iri).join('|');
    term.node_labels = Object.values(term.terms).map(t => t.node_label).join('|');
  }

  function enrichModel(m) {
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

  const nih3d = refOrgans.map((m) => ({
    purl: `https://purl.humanatlas.io/ref-organ/${m.name}/${m.version}`,
    glb_file: getGlbLink(m.dataTable),
    term_ids: m.node_ids || '',
    term_iris: m.node_iris || '',
    term_labels: m.node_labels || '',
    '3D Modeling Software': 'Maya',
    'Admin Tags': 'HRA',
    'Attribution Instructions': mdToHtml(m.citation),
    Category: 'Anatomy',
    Collection: '',
    Description: mdToHtml(m.description),
    'Diagnostic Code': '',
    'Experimental Method': '',
    'FILE: Contour Level': '',
    'FILE: Is Optimized for 3D Printing': '',
    'FILE: Make Raw Data Available': '',
    'FILE: Pixel Spacing': '',
    'FILE: Polygons': '',
    'FILE: Vertex Color': '',
    'FILE: Vertices': '',
    'FILE: Voxel Dimensions': '',
    'Imaging Modality': '',
    'Institutional Affiliation': '',
    'Is this Human Data?': 'Yes',
    Keywords: 'HRA',
    License: mdToHtml(m.license),
    'Medical Application': '',
    'NIH 3D Contributors': '',
    'Radiation Dose': '',
    'Segmentation Software': '',
    'Supplementary Files: 3D Mesh and Material Files': '',
    'Supplementary Files: Documentation Files': '',
    'Supplementary Files: Image Files': '',
    'Supplementary Files: Medical Imaging File(s)': '',
    'Supplementary Files: Scientific Data Files': '',
    'This is a Remix from this External Source': '',
    'This is a Remix of NIH 3D Entry': '',
    Title: mdToHtml(m.title),
    'Use of Anatomical Model': '',
    'PubMed ID': '',
    'Entry Metadata': '',
    'Submission Date': '',
    'Publication Date': m.creation_date,
    'Username/Content Owner': 'katy@iu.edu',
  }));

  fs.writeFileSync('../scratch/hra-v1.4.nih3d-metadata.csv', Papa.unparse(nih3d));
}
main();

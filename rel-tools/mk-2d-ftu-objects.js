const fs = require('fs');
const glob = require('glob');
const Papa = require('papaparse');

const output = '../scratch/2d-ftu-illustrations.jsonld';
const baseIri = 'https://purl.humanatlas.io/2d-ftu/';
const MAPPING = '../v1.4/2d-ftu/asct-b-2d-models-crosswalk.csv';

const iriLookup = {};
const refIllustrations = {};

const MIMETYPES = {
  svg: 'image/svg+xml',
  ai: 'application/pdf',
  png: 'image/png',
};

function getIllustrationFiles(iri, id) {
  const files = glob.sync(`../v1.*/2d-ftu/2d-ftu-${id}.*`);
  files.reverse();
  return files.map((f) => {
    const ext = f.split('.').slice(-1)[0];
    // const url = `https://hubmapconsortium.github.io/ccf-releases/${f.slice(3)}`;
    const url = `assets/TEMP/temp-svgs/2d-ftu-${id}.${ext}`;
    return {
      '@id': `${iri}#${ext}_file`,
      '@type': 'FtuIllustrationFile',
      file: url,
      file_format: MIMETYPES[ext] || ext,
    };
  });
}

const lookupRows = Papa.parse(fs.readFileSync('2d-ftu-lookup.csv').toString(), {
  header: true,
  skipEmptyLines: true,
}).data;
for (const row of lookupRows) {
  const iri = `${baseIri}${row.id}`;
  iriLookup[row.old_id] = iri;
  refIllustrations[iri] = {
    '@id': iri,
    '@type': 'FtuIllustration',
    representation_of: row.representation_of,
    label: row.label,
    organ_id: '',
    organ_label: '',
    illustration_files: getIllustrationFiles(iri, row.id),
  };
}

const mappingText = fs
  .readFileSync(MAPPING)
  .toString()
  .split('\n')
  .slice(10)
  .join('\n');
const mappingRows = Papa.parse(mappingText, { header: true }).data;
for (const row of mappingRows) {
  const iri = iriLookup[row['anatomical_structure_of']];
  const illustration = (refIllustrations[iri] = refIllustrations[iri] || {});

  illustration.organ_id = row.organ_id;
  illustration.organ_label = row.organ_label;

  const mapping = (illustration.mapping = illustration.mapping || []);
  mapping.push({
    '@id': `${iri}#${row.node_name}`,
    '@type': 'FtuIllustrationNode',
    svg_id: row.node_name,
    svg_group_id: row.node_group,
    label: row.label,
    representation_of: row.representation_of,
  });
}

const results = Object.values(refIllustrations);
const jsonld = {
  '@context': [
    'https://hubmapconsortium.github.io/ccf-ontology/ccf-context.jsonld',
    {
      "UBERON": {
        "@id": "http://purl.obolibrary.org/obo/UBERON_",
        "@prefix": true
      },
      illustration_files: {
        '@id': 'ccf:has_illustration_file',
        '@type': '@id'
      },
      mapping: {
        '@id': 'ccf:has_illustration_node',
        '@type': '@id'
      },
      organ_id: {
        '@id': 'ccf:organ_id',
        '@type': '@id'
      }
    }
  ],
  '@graph': results,
};

fs.writeFileSync(output, JSON.stringify(jsonld, null, 2));

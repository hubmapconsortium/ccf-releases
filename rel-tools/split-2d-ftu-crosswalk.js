const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const yaml = require('js-yaml');

const crosswalkDo = process.argv[2];
const doString = process.argv[3];
const doName = doString.split('/')[1];
const LOOKUP = '2d-ftu-lookup.csv';
const FIRST_COL = 'anatomical_structure_of';

const ftuLookupRows = Papa.parse(fs.readFileSync(LOOKUP).toString(), {
  header: true,
  skipEmptyLines: true,
}).data;
const ftuInfo = ftuLookupRows.find((row) => row.id === doName);
if (!ftuInfo) {
  console.log(`can't find ${doName} in ${crosswalkDo}`);
  process.exit();
}
const oldFtuIds = new Set(ftuLookupRows.filter((row) => row.id === doName).map((row) => row.old_id));

// Load the full crosswalk
const crosswalkMetaFile = path.resolve('../scratch/digital-objects', crosswalkDo, 'raw/metadata.yaml');
const crosswalkMetadata = yaml.load(fs.readFileSync(crosswalkMetaFile).toString());
const crosswalkFile = crosswalkMetadata.datatable.find((s) => s.includes('.csv'));
const crosswalkPath = path.resolve('../scratch/digital-objects', crosswalkDo, 'raw', crosswalkFile);
const crosswalkLines = fs.readFileSync(crosswalkPath).toString().split('\n');
const headerRow = crosswalkLines.findIndex((line) => line.includes(FIRST_COL));
const crosswalkText = crosswalkLines.slice(headerRow).join('\n');
const crosswalkRows = Papa.parse(crosswalkText, { header: true }).data.filter((row) => row['OntologyID'] !== '-' && row['OntologyID'] !== '');

const ftuCrosswalkRows = crosswalkRows
  .filter((row) => {
    const id = row.anatomical_structure_of;
    return oldFtuIds.has(id) || (id === '#FTUAlveolus' && oldFtuIds.has('#FTUAlveoli'));
  })
  .map((row) => ({
    node_id: row.node_name,
    node_label: row.label,
    node_mapped_to: row.OntologyID,
    tissue_label: ftuInfo.label,
    tissue_mapped_to: ftuInfo.representation_of,
    organ_label: row.organ_label || ftuInfo.organ_label,
    organ_mapped_to: row.organ_id || ftuInfo.organ_id,
  }));

// Remove duplicates
const seen = new Set();
const ftuCrosswalk = [];
for (const row of ftuCrosswalkRows) {
  if (!seen.has(row.node_id)) {
    seen.add(row.node_id);
    ftuCrosswalk.push(row);
  }
}

const ftuCrosswalkFile = path.resolve('../scratch/digital-objects', doString, 'raw/crosswalk.csv');
fs.writeFileSync(ftuCrosswalkFile, Papa.unparse(ftuCrosswalk, { header: true }));
if (ftuCrosswalk.length === 0) {
  console.log(`Warning (may not be an error): no rows found in ${crosswalkDo} for ${doString}`);
}

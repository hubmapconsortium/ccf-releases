const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const yaml = require('js-yaml');

const crosswalkDo = process.argv[2];
const refOrganDo = process.argv[3];
const LOOKUP = 'ref-organ-lookup.csv';
const FIRST_COL = 'anatomical_structure_of';

// Get reference organ GLB filename
const refOrganMetadataFile = path.resolve('../scratch/digital-objects', refOrganDo, 'raw/metadata.yaml');
const refOrganMetadata = yaml.load(fs.readFileSync(refOrganMetadataFile).toString());
const glbFile = refOrganMetadata.datatable.find((s) => s.includes('.glb')).replace(/\.glb.*/, '');

// Find the old id for a reference organ
const refOrganIdLookupRows = Papa.parse(fs.readFileSync(LOOKUP).toString(), {
  header: true,
  skipEmptyLines: true,
}).data;
const refOrganIdInfo = refOrganIdLookupRows.find(
  (row) => glbFile.includes(row.glbFile) || row.glbFile.includes(glbFile)
);
if (!refOrganIdInfo && !refOrganDo.startsWith('ref-organ/united-')) {
  console.log(`can't find lookup from ${crosswalkDo} (${glbFile}) for ${refOrganDo}`);
  process.exit();
}
const refOrgan = refOrganIdInfo?.['oldId'];

// Load the full crosswalk
const crosswalkMetaFile = path.resolve('../scratch/digital-objects', crosswalkDo, 'raw/metadata.yaml');
const crosswalkMetadata = yaml.load(fs.readFileSync(crosswalkMetaFile).toString());
const crosswalkFile = crosswalkMetadata.datatable.find((s) => s.includes('.csv'));
const crosswalkPath = path.resolve('../scratch/digital-objects', crosswalkDo, 'raw', crosswalkFile);
const crosswalkLines = fs.readFileSync(crosswalkPath).toString().split('\n');
const headerRow = crosswalkLines.findIndex((line) => line.startsWith(FIRST_COL));
const crosswalkText = crosswalkLines.slice(headerRow).join('\n');
const crosswalkRows = Papa.parse(crosswalkText, { header: true }).data.filter((row) => row['OntologyID'] !== '-');

// Filter the full crosswalk to just the info we need for this reference organ
const refOrganCrosswalk = crosswalkRows.filter((row) => {
  const id = row['anatomical_structure_of'];

  return (
    id.startsWith(refOrgan) ||
    // united uses all nodes as crosswalk
    refOrganDo.startsWith('ref-organ/united-') ||
    // Some exceptions as IDs have changed over the years
    (id === '#VHFColon' && refOrgan === '#VHFLargeIntestine') ||
    (id === '#VHFLymphNode' && glbFile === 'NIH_F_Lymph_Node') ||
    (id === '#VHMLymphNode' && glbFile === 'NIH_M_Lymph_Node')
  );
});
const refOrganCrosswalkFile = path.resolve('../scratch/digital-objects', refOrganDo, 'raw/crosswalk.csv');
fs.writeFileSync(
  refOrganCrosswalkFile,
  Papa.unparse(refOrganCrosswalk, { header: true, columns: ['node_name', 'OntologyID', 'label'] })
);
if (refOrganCrosswalk.length === 0) {
  console.log(`no rows found in ${crosswalkDo} for ${refOrganDo}`);
}

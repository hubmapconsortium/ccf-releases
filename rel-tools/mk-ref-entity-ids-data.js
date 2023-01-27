const fs = require('fs');

const HRA_VERSION='v1.3'
const BASE_ENTITY_URL='https://entity.api.hubmapconsortium.org/redirect';
const BASE_RELEASE_URL=`https://hubmapconsortium.github.io/ccf-releases/${HRA_VERSION}/docs`;
const BASE_DOI_URL=`https://doi.org/10.48539`;

function getBase(s) {
  return s.split('.')[0];
}

const db = fs.readFileSync('scratch/hubmap-ids.tsv')
  .toString().trim().split('\n').map(r => r.trim().split('\t'))
  .reduce((acc, [file, hubmap_id], rank) => {
    const base = getBase(file);
    acc[base] = {
      rank,
      base,
      hubmap_id,
      landing_page_to_register: `${BASE_ENTITY_URL}/${hubmap_id}`,
      doi: `${BASE_DOI_URL}/${hubmap_id}`
    };
    return acc;
   }, {});


const NOT_DO_TYPES=new Set(['index.html', 'styles.css', 'img']);
const doTypes = fs.readdirSync(`${HRA_VERSION}/docs`).filter(n => !NOT_DO_TYPES.has(n));
for (const type of doTypes) {
  for (const file of fs.readdirSync(`${HRA_VERSION}/docs/${type}`)) {
    const base = getBase(file);
    if (base in db) {
      db[base].data_information_page = `${BASE_RELEASE_URL}/${type}/${base}.html`;
    }
  }
}

const tsvData = Object.values(db).sort((a, b) => a.rank - b.rank).map((item) => {
  return [ item.hubmap_id, item.landing_page_to_register, item.data_information_page, item.doi ];
}).map(n => n.join('\t')).join('\n');

console.log(tsvData);
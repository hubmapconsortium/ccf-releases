const fs = require('fs');

const PREV_HRA='v1.2'
const HRA_VERSION='v1.3'

function getBase(s) {
  return s.split('.')[0];
}

const NOT_DO_TYPES=new Set(['index.html', 'styles.css', 'img']);
const doTypes = fs.readdirSync(`${HRA_VERSION}/docs`).filter(n => !NOT_DO_TYPES.has(n));

// const newOrUpdated = new Set(
//   fs.readFileSync('reference-entity-ids.tsv').toString()
//   .trim().split('\n').map(r => r.split('\t')));

for (const type of doTypes) {
  if (!fs.existsSync(`${HRA_VERSION}/markdown/${type}`)) {
    fs.mkdirSync(`${HRA_VERSION}/markdown/${type}`);
  }

  const newFiles = new Set(fs.readdirSync(`${HRA_VERSION}/markdown/${type}`).map(getBase));
  const oldFiles = new Set(fs.readdirSync(`${PREV_HRA}/markdown/${type}`).map(getBase));

  for (const file of fs.readdirSync(`${HRA_VERSION}/docs/${type}`)) {
    const base = getBase(file);
    const newMd = `${HRA_VERSION}/markdown/${type}/${base}.md`;
    const prevMd = `${PREV_HRA}/markdown/${type}/${base}.md`;

    if (oldFiles.has(base)) {
      const md = fs.readFileSync(prevMd).toString();
      const baseDataUrl = 'https://cdn.humanatlas.io/hra-releases/'
      const dataLine = md.split('\n').find(n => n.includes(baseDataUrl + 'v1.'));
      const dataUrl = dataLine.slice(dataLine.indexOf('(')+1, dataLine.indexOf(')'));

      const oldDo = dataUrl.replace(baseDataUrl, '');
      const newDo = `${HRA_VERSION}/${oldDo.split('/').slice(1).join('/')}`;

      fs.copyFileSync(oldDo, newDo);
      fs.copyFileSync(prevMd, newMd);
    }
  }
}

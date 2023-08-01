const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const yaml = require('js-yaml');

const hraVersion = process.argv.length > 2 ? process.argv[2] : 'v1.4';
const hraRaw = `../scratch/digital-objects/collection/hra/${hraVersion}/raw`;
const hraMeta = `../scratch/hra-${hraVersion}-metadata.json`;

sh.mkdir('-p', hraRaw);
const digitalObjects = sh
  .ls('../scratch/digital-objects/*/*/*/raw/metadata.yaml')
  .map((s) => s.split('/').slice(3, 6).join('/'))
  .filter((s) => !s.includes('/hra/'));

fs.writeFileSync(
  path.resolve(hraRaw, 'digital-objects.yaml'),
  yaml.dump({ ['digital-objects']: digitalObjects })
);

const results = [];
for (const doPath of digitalObjects) {
  const doMetaFile = `../scratch/digital-objects/${doPath}/raw/metadata.yaml`;
  const metadata = yaml.load(fs.readFileSync(doMetaFile).toString());
  const [ type, name, version ] = doPath.split('/');
  results.push({
    type, name, version, ...metadata
  });
}

fs.writeFileSync(hraMeta, JSON.stringify(results, null, 2));

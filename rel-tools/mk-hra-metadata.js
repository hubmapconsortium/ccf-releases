const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const yaml = require('js-yaml');

const hraVersion = process.argv.length > 2 ? process.argv[2] : 'v1.4';

const hraRaw = `../scratch/digital-objects/collection/hra/${hraVersion}/raw`;
sh.mkdir('-p', hraRaw);
const digitalObjects = sh
  .ls('../scratch/digital-objects/*/*/*/raw/metadata.yaml')
  .map((s) => s.split('/').slice(2, 5).join('/'))
  .filter((s) => !s.includes('/hra/'));

fs.writeFileSync(
  path.resolve(hraRaw, 'digital-objects.yaml'),
  yaml.dump({ ['digital-objects']: digitalObjects })
);

const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const yaml = require('js-yaml');
const HraMarkdownParser = require('./md-parser').HraMarkdownParser;

function writeDigitalObject(md) {
  data = md.toJson();
  // Write out metadata.yaml
  const yamlDir = `../scratch/digital-objects/${md.getDoType()}/${md.getName()}/${md.getVersion()}/raw`;
  sh.mkdir('-p', yamlDir);

  const dataPaths = data.dataTable
    .match(/\(https\:\/\/.*?\)/g)
    .map((u) => u.slice(1, -1).split('/').slice(-3).join('/'));

  Object.assign(data, {
    type: undefined,
    name: undefined,
    version: undefined,
    creation_year: undefined,
    accessed_date: undefined,
    dataTable: undefined,
    datatable: [],
  });

  for (const inputSrcPath of dataPaths) {
    let srcName = inputSrcPath.split('/').slice(-1)[0];
    const srcPath = path.resolve('..', inputSrcPath);
    let destPath = path.resolve(yamlDir, srcName);
    
    sh.cp(srcPath, destPath);

    if (srcPath.endsWith('.zip')) {
      srcName = srcName.replace('.zip', '');
      destPath = destPath.replace('.zip', '');
      sh.exec(`unzip -o ${srcPath} -d ${yamlDir} ${srcName}`);
    } else if (srcPath.endsWith('.bz2')) {
      srcName = srcName.replace('.bz2', '');
      destPath = destPath.replace('.bz2', '');
      sh.exec(`bunzip2 -c ${srcPath} > ${destPath}`);
    } if (srcPath.endsWith('.7z')) {
      srcName = srcName.replace('.7z', '');
      destPath = destPath.replace('.7z', '');
      sh.exec(`7z e -aoa ${srcPath} -o${yamlDir} ${srcName}`);
    }

    data.datatable.push(srcName);
    if (!fs.existsSync(srcPath) || !fs.existsSync(destPath)) {
      console.log(md.inputFile, md.getDoType(), srcPath, destPath);
    }
  }

  fs.writeFileSync(yamlDir + '/metadata.yaml', yaml.dump(data));
}

const OUT = '../scratch/digital-objects';
// sh.rm('-r', OUT);
sh.mkdir('-p', OUT);

const allMd = sh
  .ls('../v1.*/markdown/*/*.md')
  .map((s) => s.split('/'))
  .map((s) => [s[1], s[3], s[4].replace('.md', '')]);

const collections = {};
for (const [collectionVersion, type, name] of allMd) {
  const parser = new HraMarkdownParser(`../${collectionVersion}/markdown/${type}/${name}.md`);
  writeDigitalObject(parser);

  collections[collectionVersion] = collections[collectionVersion] || [];
  collections[collectionVersion].push(parser.getDoString());
}

for (const [version, digitalObjects] of Object.entries(collections)) {
  const yamlDir = `../scratch/digital-objects/collection/hra/${version}/raw`;
  sh.mkdir('-p', yamlDir);

  fs.writeFileSync(yamlDir + '/digital-objects.yaml', yaml.dump({ 'digital-objects': digitalObjects }));

  sh.cp('hra-metadata.yaml', yamlDir + '/metadata.yaml');

  const crosswalk = digitalObjects.find(str => str.startsWith('2d-ftu/') && str.includes('crosswalk'));
  const ftuIllustrations = digitalObjects.filter(str => str.startsWith('2d-ftu/') && !str.includes('crosswalk'));
  for (const doString of ftuIllustrations) {
    sh.exec(`node ./split-2d-ftu-crosswalk.js ${crosswalk} ${doString}`);
  }

  const refOrganCrosswalk = digitalObjects.find(str => str.startsWith('ref-organ/') && str.includes('crosswalk'));
  const refOrgans = digitalObjects.filter(str => str.startsWith('ref-organ/') && !str.includes('crosswalk'));
  for (const doString of refOrgans) {
    sh.exec(`node ./split-ref-organ-crosswalk.js ${refOrganCrosswalk} ${doString}`);
  }
}

fs.writeFileSync('../scratch/collections.json', JSON.stringify(collections, null, 2));

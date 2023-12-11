const glob = require('glob');
const fs = require('fs');
const sh = require('shelljs');
const HraMarkdownParser = require('./md-parser').HraMarkdownParser;

const ENTITIES_TSV = '../reference-entity-ids.tsv';
const VERSION = 'v2.0';

const entities = new Set(
  fs
    .readFileSync(ENTITIES_TSV)
    .toString()
    .split('\n')
    .map((line) => line.split('\t')[0].trim())
);

for (const md of glob.sync(`../${VERSION}/markdown/*/*.md`)) {
  const parser = new HraMarkdownParser(md);
  const data = parser.toJson();
  const hubmapId = data.hubmapId;
  const doi = data.doi;
  const asHtml = md.split('/').slice(-2).join('/').replace('.md', '.html');
  if (doi && hubmapId && !entities.has(hubmapId)) {
    console.log(
      [
        hubmapId,
        `https://entity.api.hubmapconsortium.org/redirect/${hubmapId}`,
        `https://cdn.humanatlas.io/hra-releases/${VERSION}/docs/${asHtml}`,
        `https://doi.org/10.48539/${hubmapId}`,
      ].join('\t')
    );
  } else {
    console.log(data);
    process.exit(-1);
  }
}

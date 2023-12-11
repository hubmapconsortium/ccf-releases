const fs = require('fs');
const nunjucks = require('nunjucks');
const HraMarkdownParser = require('./md-parser').HraMarkdownParser;

INPUT_MD = process.argv[2];
OUTPUT_XML = process.argv[3];

const TYPE_MAPPINGS = {
  model_mappings: {
    'asct-b': 'ASCT+B',
    '2d-ftu': '2D Reference FTU',
    omap: 'Organ Mapping Antibody Panels(OMAPs)',
    'ref-organ': '3D Reference Organs',
    'vascular-geometry': 'Vascular Geometries',
  },
  resource_mappings: {
    'asct-b': 'Dataset',
    '2d-ftu': 'Image',
    omap: 'Dataset',
    'ref-organ': 'Model',
    'vascular-geometry': 'Dataset',
    'asct-b-crosswalk': 'Dataset',
    'ref-organ-crosswalk': 'Dataset',
    '2d-ftu-crosswalk': 'Dataset',
  },
  resource_title_mappings: {
    'asct-b': 'ASCT+B Table',
    '2d-ftu': '2D reference human organ FTU object',
    omap: 'Organ Mapping Antibody Panel',
    'ref-organ': '3D reference human organ model',
    'vascular-geometry': 'Vascular Geometry Table',
    'asct-b-crosswalk': 'ASCT+B Crosswalk Table',
    '2d-ftu-crosswalk': 'ASCT+B table to 2D FTU crosswalk Table',
    'ref-organ-crosswalk': 'ASCT+B table to 3D model crosswalk Table',
  },
  cite_model_mappings: {
    'asct-b': 'Data Table',
    '2d-ftu': '2D Data',
    omap: 'OMAP Tables',
    'ref-organ': '3D Data',
    'vascular-geometry': 'Data Table',
  },
  cite_overall_model_mappings: {
    'asct-b': 'ASCT+B Tables',
    '2d-ftu': '2D Data',
    omap: 'OMAP Tables',
    'ref-organ': '3D Data',
    'vascular-geometry': 'Vascular Geometry Tables',
  },
  extension_fixes: { ai: 'svg', xlsx: 'csv' },
};

function renderTemplate(templateFile, data) {
  nunjucks.configure({ autoescape: false });
  const env = new nunjucks.Environment();
  env.addFilter('fileExtension', (str) => {
    str = str.replace('.zip', '').replace('.7z', '');
    const ext = str !== undefined ? str.slice(str.lastIndexOf('.') + 1).replace(')', '') : '';
    return TYPE_MAPPINGS.extension_fixes[ext] || ext;
  });
  env.addFilter('mdLinkAsUrlOnly', (str) => str.slice(str.lastIndexOf('(') + 1, str.lastIndexOf(')') - 1));
  env.addFilter('mdLinkAsTitleOnly', (str) =>
    str.indexOf('CC BY') !== -1
      ? 'Creative Commons Attribution 4.0 International (CC BY 4.0)'
      : str.slice(str.lastIndexOf('[') + 1, str.lastIndexOf(']')).replace(/\*/g, '')
  );
  env.addFilter('mdLinkAsUrl', (str) => str.replace(/\[.*\]\(/g, '').replace(/\)/g, ''));
  env.addFilter('mdLinkAsTitle', (str) => str.replace(/\**\]\([^\]].*\)/g, '').replace(/\[\**/g, ''));
  const template = fs.readFileSync(templateFile).toString();
  return env.renderString(template, { ...data, ...TYPE_MAPPINGS });
}

const md = new HraMarkdownParser(INPUT_MD);
const data = md.toJson();
data.resource_type = md.getResourceType();

// Write out DOI/XML
const xml = renderTemplate('doi-xml-template.njk', data);
fs.writeFileSync(OUTPUT_XML, xml);

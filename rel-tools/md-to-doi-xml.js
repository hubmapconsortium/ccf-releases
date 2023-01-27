const fs = require('fs');
const nunjucks = require('nunjucks');

INPUT_MD = process.argv[2];
OUTPUT_XML = process.argv[3];

const TYPE_MAPPINGS = {
  model_mappings: {'asct-b':'ASCT+B','2d-ftu':'2D Reference FTU','omap':'Organ Mapping Antibody Panels(OMAPs)','ref-organs': '3D Reference Organs'},
  resource_mappings: {'asct-b': 'Dataset','2d-ftu':'Image','omap':'Dataset','ref-organs': 'Model'},
  resource_title_mappings: {'asct-b': 'ASCT+B Table','2d-ftu':'2D reference human organ FTU object','omap':'Organ Mapping Antibody Panel','ref-organs':'3D reference human organ model'},
  cite_model_mappings: {'asct-b':'Data Table','2d-ftu':'2D Data','omap':'OMAP Tables','ref-organs':'3D Data' },
  cite_overall_model_mappings: {'asct-b':'ASCT+B Tables','2d-ftu':'2D Data','omap':'OMAP Tables','ref-organs':'3D Data' },
  extension_fixes: { 'ai': 'svg', 'xlsx': 'csv' }
}

class HraMarkdownParser {
  constructor(inputFile) {
    this.inputFile = inputFile;
    this.rawMd = fs.readFileSync(INPUT_MD).toString()
      .replace(/\&ouml\;/g, 'ö')
      .trim().split('\n');
  }

  hasKey(key) {
    return !!this.rawMd.find(l => l.includes(`**${key}:**`));
  }
  getMetadata(key) {
    if (!this.hasKey(key)) {
      return '';
    }
    return this.rawMd.find(l => l.includes(`**${key}:**`)).split('|')[2].trim();
  }
  getMultiValue(key) {
    return this.getMetadata(key).replace('&ouml;', 'ö').split(/[\;\,]\ */g).map(n => n.trim());
  }
  getAccessedDate(dateStr) {
    const [_dayOfWeek, month, day, year] = new Date(dateStr).toDateString().split(' ')
    return `${month} ${parseInt(day, 10)}, ${year}`;
  }
  getAuthors(nameKey, orcidKey) {
    if (!this.hasKey(nameKey) || !this.hasKey(orcidKey)) {
      return [];
    }
    const names = this.getMultiValue(nameKey);
    const orcids = this.getMultiValue(orcidKey).map(n => n.slice(n.indexOf('[')+1, n.indexOf(']')).trim());
    return names.map((fullName, index) => ({
      fullName,
      firstName: fullName.split(/\ +/g).slice(0)[0],
      lastName: fullName.replace(/\ II$/g, '').split(/\ +/g).slice(-1)[0],
      orcid: orcids[index]
    }));
  }
  getFunders(funderKey, awardKey) {
    const funders = this.getMultiValue(funderKey);
    const awards = this.getMultiValue(awardKey);

    return funders.map((funder, index) => ({
      funder, awardNumber: awards[index]
    }));
  }

  getTitle() {
    return this.rawMd[0].slice(1).trim();
  }
  getDescription() {
    return this.rawMd[this.rawMd.findIndex(n => n.startsWith('### Description'))+1].trim()
  }
  getHowToCiteKey() {
    return this.rawMd.find(l => l.includes('**How to Cite') && !l.includes('Overall:**'))
      .split('|')[1].trim().replace(/\*/g,'').replace(/\:/g,'');
  }
  getHowToCiteOverallKey() {
    return this.rawMd.find(l => l.includes('**How to Cite') && l.includes('Overall:**'))
      .split('|')[1].trim().replace(/\*/g,'').replace(/\:/g,'');
  }

  getDoType() {
    return this.inputFile.split('/').slice(-2)[0];
  }

  toJson() {
    return {
      type: this.getDoType(),
      title: this.getTitle(),
      description: this.getDescription(),
      
      creators: [
        ...this.getAuthors('Creator(s)', 'Creator ORCID(s)'),
        ...this.getAuthors('Creator(s)', 'Creator ORCID')
      ],
      project_leads: this.getAuthors('Project Lead', 'Project Lead ORCID'),
      reviewers: [
        ...this.getAuthors('Reviewer(s)', 'Reviewers ORCID(s)'),
        ...this.getAuthors('Reviewer(s)', 'Reviewer ORCID(s)'),
        ...this.getAuthors('Internal Reviewer(s)', 'Internal Reviewer ORCID(s)')
      ],
      externalReviewers: this.getAuthors('External Reviewer(s)', 'External Reviewer ORCID(s)'),

      creation_date: this.getMetadata('Creation Date') || this.getMetadata('Date'),
      creation_year: (this.getMetadata('Creation Date') || this.getMetadata('Date')).split('-')[0],
      accessed_date: this.getAccessedDate(this.getMetadata('Creation Date') || this.getMetadata('Date')),
    
      license: this.getMetadata('License'),
      publisher: this.getMetadata('Publisher'),
      funders: this.getFunders('Funder', 'Award Number'),
      hubmapId: this.getMetadata('HuBMAP ID'),
      dataTable: this.getMetadata('Data Table') || this.getMetadata('3D Data') || this.getMetadata('2D Data'),
      doi: this.getMetadata('DOI').split('[')[1].split(']')[0],
      citation: this.getMetadata(this.getHowToCiteKey()),
      citationOverall: this.getMetadata(this.getHowToCiteOverallKey())
    };
  }
}

function renderTemplate(templateFile, data) {
  nunjucks.configure({ autoescape: false });
  const env = new nunjucks.Environment();
  env.addFilter('fileExtension', (str) => {
    const ext = str !== undefined ? str.slice(str.replace('.zip', '').lastIndexOf('.') + 1).replace(')', '') : '';
    return TYPE_MAPPINGS.extension_fixes[ext] || ext;
  });
  env.addFilter('mdLinkAsUrlOnly', (str) =>
    str.slice(str.lastIndexOf('(') + 1, str.lastIndexOf(')') -1)
  );
  env.addFilter('mdLinkAsTitleOnly', (str) =>
    str.indexOf('CC BY') !== -1 ? 'Creative Commons Attribution 4.0 International (CC BY 4.0)'
      : str.slice(str.lastIndexOf('[') + 1, str.lastIndexOf(']')).replace(/\*/g, '')
  );
  env.addFilter('mdLinkAsUrl', (str) =>
    str.replace(/\[.*\]\(/g, '').replace(/\)/g,'')
  );
  env.addFilter('mdLinkAsTitle', (str) =>
    str.replace(/\**\]\([^\]].*\)/g, '').replace(/\[\**/g, '')
  );
  const template = fs.readFileSync(templateFile).toString();
  return env.renderString(template, { ...data, ...TYPE_MAPPINGS });
}

const md = new HraMarkdownParser(INPUT_MD);
const data = md.toJson();

fs.writeFileSync(OUTPUT_XML+'.json', JSON.stringify(data, null, 2))
const xml = renderTemplate('doi-xml-template.njk', data);
fs.writeFileSync(OUTPUT_XML, xml);

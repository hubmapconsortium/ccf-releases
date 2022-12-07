module.exports = function (config) {
  config.addCollection('ind_orcids', function (collectionApi) {
    const individuals = collectionApi.getFilteredByTag('individuals');
    let orcid_ind_dict = {};
    for (let i of individuals) {
      let data = i.data.individual;
      if (!(data.orcid in orcid_ind_dict)) {
        orcid_ind_dict[data.orcid] = {
          fName: data.first_name,
          mName: data.middle_name,
          lName: data.last_name,
        };
      }
    }
    return orcid_ind_dict;
  });

  config.addCollection(
    'release_digital_objects',
    function (collectionApi) {
      const digital_objects = collectionApi.getFilteredByTag('digital_objects');
      const hra_releases = collectionApi.getFilteredByTag('hra_releases');
      let release_files_dict = {};
      for (let d_o of digital_objects) {
        let release = d_o.data.release_version;
        let hra_releases = d_o.data.hra_release_version;
        let model_type = d_o.data.type;
        let d_o_url =
          '/' +
          release +
          '/docs/' +
          model_type +
          '/' +
          d_o.data.title +
          '.html';
        if (!(release in release_files_dict)) {
          release_files_dict[release] = Array(d_o_url);
        } else {
          release_files_dict[release].push(d_o_url);
        }
      }
      return release_files_dict;
    }
  );

  config.addCollection('digitalObjectTypes', function (collectionApi) {
    return collectionApi.getFilteredByTag('digital_object_types');
  });

  config.addCollection('releases', function (collectionApi) {
    return collectionApi.getFilteredByTag('hra_releases');
  });

  config.addFilter('get_baseHref', function(value) {
    return process.env['BASE_HREF'] || value; 
  })

  config.addFilter('get_year', function (value) {
    date = new Date(value);
    return date.getFullYear();
  });
  config.addFilter('get_model_type', function (value) {
    if (value == undefined) {
      return;
    } else {
      return value.split('/')[3];
    }
  });
  config.addFilter('get_file_title', function (value) {
    if (value == undefined) {
      return;
    } else {
      return value.split('/')[4];
    }
  });

  config.addFilter('myDateFilter', function (value) {
    date = new Date(value);
    return date.getMonth() > 8
      ? date.getMonth() + 1
      : '0' +
          (date.getMonth() + 1) +
          '/' +
          (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
          '/' +
          date.getFullYear();
  });

  config.addFilter('get_fullName', function (value) {
    const { fName, mName, lName } = value ?? {};
    return [ fName, mName, lName].filter(x => x?.length > 0).join(' ');
  });
  config.addFilter('get_title', function (value) {
    return value.slice(value.indexOf('[') + 1, value.indexOf(']'));
  });
  config.addFilter('get_extension', function (value) {
    if (value != undefined) {
      return value.slice(value.indexOf('.'));
    } else {
      return null;
    }
  });

  config.addPairedShortcode("setPageVar", function(content, name) { 
    this.page[name] = content;
    return '';
  });

  config.addCollection('digital_objects', function (collectionApi) {
    return collectionApi.getFilteredByTag('digital_objects');
  });

  //2d-FTU files copied
  //Add new releases in the similar format for future releases

  config.addPassthroughCopy({
    'content/digital-objects/v1-3/2d-ftu/docs/*.svg': 'v1.3/2d-ftu',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-3/2d-ftu/docs/*.csv': 'v1.3/2d-ftu',
  });

  config.addPassthroughCopy({
    'content/digital-objects/v1-2/2d-ftu/docs/*.svg': 'v1.2/2d-ftu',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-2/2d-ftu/docs/*.csv': 'v1.2/2d-ftu',
  });

  config.addPassthroughCopy({
    'content/digital-objects/v1-1/2d-ftu/docs/*.csv': 'v1.1/2d-ftu',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-1/2d-ftu/docs/*.svg': 'v1.1/2d-ftu',
  });

  config.addPassthroughCopy({
    'content/digital-objects/v1-0/2d-ftu/docs/*.csv': 'v1.0/2d-ftu',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-0/2d-ftu/docs/*.svg': 'v1.0/2d-ftu',
  });

  // Copy the ASCT-B tables for each release: Add new release in similar format
  config.addPassthroughCopy({
    'content/digital-objects/v1-3/asct-b/docs/*.csv': 'v1.3/asct-b',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-2/asct-b/docs/*.csv': 'v1.2/asct-b',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-1/asct-b/docs/*.csv': 'v1.1/asct-b',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-0/asct-b/docs/*.csv': 'v1.0/asct-b',
  });

  config.addPassthroughCopy({
    'content/digital-objects/v1-3/docs/omap/*.csv': 'v1.3/omap',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-2/docs/omap/*.csv': 'v1.2/omap',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-1/docs/omap/*.csv': 'v1.1/omap',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-0/docs/omap/*.csv': 'v1.0/omap',
  });

  // Copy the glb files
  config.addPassthroughCopy({
    'content/digital-objects/v1-3/ref-organs/docs/*.glb': 'v1.3/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-2/ref-organs/docs/*.glb': 'v1.2/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-1/ref-organs/docs/*.glb': 'v1.1/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-0/ref-organs/docs/*.glb': 'v1.0/ref-organs',
  });

  // Copy the ref-organs csv files
  config.addPassthroughCopy({
    'content/digital-objects/v1-3/ref-organs/docs/*.csv': 'v1.3/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-2/ref-organs/docs/*.csv': 'v1.2/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-1/ref-organs/docs/*.csv': 'v1.1/ref-organs',
  });
  config.addPassthroughCopy({
    'content/digital-objects/v1-0/ref-organs/docs/*.csv': 'v1.0/ref-organs',
  });

  //Copy Markdown files from contents to site directory

  config.addPassthroughCopy({
    '**/content/digital-objects/v1-0/ref-organs/docs/*.md':
      'v1.0/markdown/ref-organs',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-1/ref-organs/docs/*.md':
      'v1.1/markdown/ref-organs',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-2/ref-organs/docs/*.md':
      'v1.2/markdown/ref-organs',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-3/ref-organs/docs/*.md':
      'v1.3/markdown/ref-organs',
  });

  config.addPassthroughCopy({
    '**/content/digital-objects/v1-3/omap/docs/*.md': 'v1.3/markdown/omap',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-2/omap/docs/*.md': 'v1.2/markdown/omap',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-1/omap/docs/*.md': 'v1.1/markdown/omap',
  });
  config.addPassthroughCopy({
    '**/content/digital-objects/v1-0/omap/docs/*.md': 'v1.0/markdown/omap',
  });

  config.addPassthroughCopy({
    '**/content/v1-3/asct-b/docs/*.md': 'v1.3/markdown/asct-b',
  });
  config.addPassthroughCopy({
    '**/content/v1-2/asct-b/docs/*.md': 'v1.2/markdown/asct-b',
  });
  config.addPassthroughCopy({
    '**/content/v1-1/asct-b/docs/*.md': 'v1.1/markdown/asct-b',
  });
  config.addPassthroughCopy({
    '**/content/v1-0/asct-b/docs/*.md': 'v1.0/markdown/asct-b',
  });

  config.addPassthroughCopy({
    '**/content/v1-3/2d-ftu/docs/*.md': 'v1.3/markdown/2d-ftu',
  });
  config.addPassthroughCopy({
    '**/content/v1-2/2d-ftu/docs/*.md': 'v1.2/markdown/2d-ftu',
  });
  config.addPassthroughCopy({
    '**/content/v1-1/2d-ftu/docs/*.md': 'v1.1/markdown/2d-ftu',
  });
  config.addPassthroughCopy({
    '**/content/v1-0/2d-ftu/docs/*.md': 'v1.0/markdown/2d-ftu',
  });

  config.addPassthroughCopy({ public: '.' });
  config.addPassthroughCopy('admin');

  return {
    dir: {
      input: 'content',
      output: 'docs',
      includes: '../src/_includes',
    },
  };
};

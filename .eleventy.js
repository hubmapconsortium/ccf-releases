module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("ind_orcids", function (collectionApi) {
    const individuals = collectionApi.getFilteredByTag("individuals");
    let orcid_ind_dict = {}
    for (let i of individuals) {
      let data = i.data.individual
      if (!(data.orcid in orcid_ind_dict)) {
        orcid_ind_dict[data.orcid] = { "fName": data.first_name, "mName": data.middle_name, "lName": data.last_name }
      }
    }
    return orcid_ind_dict;
  })

  eleventyConfig.addCollection("hra-releases", function (collectionApi) {
    return collectionApi.getFilteredByTag("hra-releases");
  });

  eleventyConfig.addFilter("get_year", function (value) {
    date = new Date(value)
    return date.getYear()
  });

  eleventyConfig.addFilter("myDateFilter", function (value) {
    date = new Date(value)
    return (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
  });

  eleventyConfig.addFilter("get_title", function (value) {
    return value.slice(value.indexOf("["), value.indexOf("]"))
  });
  eleventyConfig.addFilter("get_extension", function (value) {
    console.log(value)
    if(value!=undefined){
      return value.slice(value.indexOf("."))
    }
    else{
      return null
    }
      
  });

  eleventyConfig.addCollection("digital_objects", function (collectionApi) {
    return collectionApi.getFilteredByTag("digital_objects");
  });

  //2d-FTU files copied
  //Add new releases in the similar format for future releases


  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/2d-ftu/*.svg": "v1.3/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/2d-ftu/*.csv": "v1.3/2d-ftu" });


  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/2d-ftu/*.svg": "v1.2/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/2d-ftu/*.csv": "v1.2/2d-ftu" });
  
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/2d-ftu/*.csv": "v1.1/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/2d-ftu/*.svg": "v1.1/2d-ftu" });
  
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/2d-ftu/*.csv": "v1.0/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/2d-ftu/*.svg": "v1.0/2d-ftu" });

  
  // Copy the ASCT-B tables for each release: Add new release in similar format
  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/asct-b/*.csv": "v1.3/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/asct-b/*.csv": "v1.2/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/asct-b/*.csv": "v1.1/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/asct-b/*.csv": "v1.0/asct-b" });


  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/omap/*.csv": "v1.3/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/omap/*.csv": "v1.2/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/omap/*.csv": "v1.1/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/omap/*.csv": "v1.0/omap" });


  // Copy the glb files
  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/ref-organs/*.glb": "v1.3/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/ref-organs/*.glb": "v1.2/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/ref-organs/*.glb": "v1.1/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/ref-organs/*.glb": "v1.0/ref-organs" });

  // Copy the ref-organs csv files
  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/ref-organs/*.csv": "v1.3/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/ref-organs/*.csv": "v1.2/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/ref-organs/*.csv": "v1.1/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/ref-organs/*.csv": "v1.0/ref-organs" });



  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/ref-organs/*.md": "v1.0/markdown/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/ref-organs/*.md": "v1.1/markdown/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/ref-organs/*.md": "v1.2/markdown/ref-organs" });
  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/ref-organs/*.md": "v1.3/markdown/ref-organs" });

  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/omap/*.md": "v1.3/markdown/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/omap/*.md": "v1.2/markdown/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/omap/*.md": "v1.1/markdown/omap" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/omap/*.md": "v1.0/markdown/omap" });


  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/asct-b/*.md": "v1.3/markdown/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/asct-b/*.md": "v1.2/markdown/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/asct-b/*.md": "v1.1/markdown/asct-b" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/asct-b/*.md": "v1.0/markdown/asct-b" });

  eleventyConfig.addPassthroughCopy({ "**/v1-3/docs/2d-ftu/*.md": "v1.3/markdown/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-2/docs/2d-ftu/*.md": "v1.2/markdown/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-1/docs/2d-ftu/*.md": "v1.1/markdown/2d-ftu" });
  eleventyConfig.addPassthroughCopy({ "**/v1-0/docs/2d-ftu/*.md": "v1.0/markdown/2d-ftu" });




  eleventyConfig.addPassthroughCopy({ "public/img": "img" })
  eleventyConfig.addPassthroughCopy("admin");

  return {
    dir: {
      input: 'content',
      output: 'docs',
      includes: "../src/_includes"
    }
  }
};

const { EleventyRenderPlugin } = require("@11ty/eleventy");



module.exports = function (eleventyConfig) {
  
var final_releases=[];
var models=[];

  eleventyConfig.addCollection("ind_orcids", function(collectionApi){
    const individuals = collectionApi.getFilteredByTag("individuals");
    let orcid_ind_dict= {}
    //console.log(individuals.data)
    for(let i of individuals){
      let data = i.data.individual
      //console.log(data)
      if(!(data.orcid in orcid_ind_dict)){
      orcid_ind_dict[data.orcid]={"fName":data.first_name,"mName":data.middle_name,"lName":data.last_name}
      }
    

    }
    return orcid_ind_dict;
  })

  eleventyConfig.addCollection("releases", function(collectionApi) {
    const releases = collectionApi.getFilteredByTag("releases");
    const model_types = collectionApi.getFilteredByTag("models");
    for(let r of releases) {
      if(r.template){
        temp_release = r.template.fileSlugStr;
        final_release = temp_release.replace("-",".");
        final_releases.push(temp_release);
      }
    }
    
    for(let m of model_types){
        if(m.template){
          temp_model = m.template.fileSlugStr;
          models.push(temp_model)
        }
    }
    
    //console.log(final_releases.length)
    //console.log(models.length)
    
    return releases;
  });
  


  eleventyConfig.addFilter("get_year",function(value){
    date = new Date(value)
    return date.getYear()
  });

  eleventyConfig.addFilter("myDateFilter",function(value){
    date = new Date(value)
    return (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
  });

  

  eleventyConfig.addFilter("get_title", function(value){
    return value.slice(value.indexOf("["),value.indexOf("]"))
  });
  eleventyConfig.addFilter("get_extension", function(value){
    return value.slice(value.indexOf("."))
  });

  eleventyConfig.addCollection("digital_objects", function(collectionApi) {
   return collectionApi.getFilteredByTag("digital_objects");    
  });


    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/2d-ftu/*.svg":"v1.3/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/2d-ftu/*.csv":"v1.3/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/2d-ftu/*.svg":"v1.2/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/2d-ftu/*.csv":"v1.2/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/2d-ftu/*.csv":"v1.1/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/2d-ftu/*.svg":"v1.1/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/2d-ftu/*.csv":"v1.0/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/2d-ftu/*.svg":"v1.0/2d-ftu"});


    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/asct-b/*.csv":"v1.3/asct-b"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/asct-b/*.csv":"v1.2/asct-b"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/asct-b/*.csv":"v1.1/asct-b"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/asct-b/*.csv":"v1.0/asct-b"});


    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/omap/*.csv":"v1.3/omap"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/omap/*.csv":"v1.2/omap"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/omap/*.csv":"v1.1/omap"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/omap/*.csv":"v1.0/omap"});


    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/ref-organs/*.glb":"v1.3/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/ref-organs/*.glb":"v1.2/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/ref-organs/*.glb":"v1.1/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/ref-organs/*.glb":"v1.0/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-3/docs/ref-organs/*.csv":"v1.3/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/ref-organs/*.csv":"v1.2/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-1/docs/ref-organs/*.csv":"v1.1/ref-organs"});
    eleventyConfig.addPassthroughCopy({"**/v1-0/docs/ref-organs/*.csv":"v1.0/ref-organs"});
    
    eleventyConfig.addPassthroughCopy({"public":"img"})
    eleventyConfig.addPassthroughCopy("admin");
};


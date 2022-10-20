const { EleventyRenderPlugin } = require("@11ty/eleventy");
const Nunjucks = require("nunjucks");



module.exports = function (eleventyConfig) {
  
var final_releases=[];
var model_mapping = {
  "asct-b":"csv",
  "omap":"csv",
  "ref-organs":"glb",
  "2d-ftu":"svg"
}
var models=[];

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
  




  eleventyConfig.addCollection("digital_objects", function(collectionApi) {
   return collectionApi.getFilteredByTag("digital_objects");    
  });


  if(process.env.FILE_GEN == "html"){
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/omap/*.csv":"v1.2/omap"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/2d-ftu/*.svg":"v1.2/2d-ftu"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/asct-b/*.csv":"v1.2/asct-b"});
    eleventyConfig.addPassthroughCopy({"**/v1-2/docs/ref-organs/*.glb":"v1.2/ref-organs"});
  
  }
  eleventyConfig.addPassthroughCopy("admin");
};


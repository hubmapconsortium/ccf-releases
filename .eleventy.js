const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  

  
  eleventyConfig.addCollection("releases", function(collectionApi) {
    
    return collectionApi.getFilteredByTags("releases","models");
  });
  


  eleventyConfig.addPassthroughCopy({"**/docs/asct-b/*.csv":"asct-b"});
  eleventyConfig.addPassthroughCopy({"**/docs/omap/*.csv":"omap"});
  eleventyConfig.addPassthroughCopy({"**/docs/2d-ftu/*.svg":"2d-ftu"});
  eleventyConfig.addPassthroughCopy({"public/*.svg":"img"});
  eleventyConfig.addPassthroughCopy("admin");



  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addFilter("myFilter", function(value) {
    return value.substring(0,16)+"."+value.substring(17);

  });

};

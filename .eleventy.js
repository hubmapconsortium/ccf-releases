const { EleventyRenderPlugin } = require("@11ty/eleventy");
const Nunjucks = require("nunjucks");
module.exports = function (eleventyConfig) {
  
  const nunjucksEnvironment = new Nunjucks.Environment(

    // Specify the directories where your templates reside.
    new Nunjucks.FileSystemLoader(["./", "_includes", "_layouts"]),

    // Apply rendering options
    { 
      lstripBlocks: true,
      trimBlocks: true,
    }
  );

  // other
  // eleventyConfig
  // configs

  // Apply Nunjuks environment config
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  
  eleventyConfig.addCollection("releases", function(collectionApi) {
    return collectionApi.getFilteredByTags("releases","models");
    
  });
  

  let releases = ['v1-0','v1-1','v1-2','v1-3']
  let models = ["asct-b","2d-ftu","omap","ref-organs"]
  for(let x of releases)
  {
    for(let y of models)
    {

      source = "**/"+x+"/docs/"+ y +"/*.csv"
      destination = x +"/"+y 
      //console.log(source);
      //console.log(destination);
      eleventyConfig.addPassthroughCopy({source:destination});
    }
  }
  
  // eleventyConfig.addPassthroughCopy({"**/v1-2/docs/omap/*.csv":"v1.2/omap"});
  // eleventyConfig.addPassthroughCopy({"**/v1-2/docs/2d-ftu/*.svg":"v1.2/2d-ftu"});
  eleventyConfig.addPassthroughCopy({"public/*.svg":"img"});
  eleventyConfig.addPassthroughCopy("admin");




};

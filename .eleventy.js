const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");
  
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addFilter("myFilter", function(value) {
    return value.substring(0,16)+"."+value.substring(17);

  });

};

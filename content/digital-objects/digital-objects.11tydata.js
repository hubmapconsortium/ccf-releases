module.exports = function() {
    let layout = "layouts/digital_object_"+process.env.FILE_GEN+".njk"
    if ( process.env.FILE_GEN == "html"){
      
      return { layout: layout}
       
    }
    else {
      return { layout: layout }
    }
    
};
module.exports = function() {
    const layout = "layouts/digital_object_" + process.env.FILE_GEN + ".njk";
    return { layout };
};

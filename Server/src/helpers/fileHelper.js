let getFileImage = function(req, res) {
    res.download(`src/public/images/${req.params.path}/${req.params.name_image}`);
}

export default getFileImage; 
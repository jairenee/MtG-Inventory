let Jimp = require("jimp");

Jimp.read("140.jpg", function(err, bolas) {
    if (err) throw err;
    bolas.greyscale()
        .write("new-bolas.png");
})
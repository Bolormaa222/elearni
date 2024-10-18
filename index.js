const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require("cors");
const crypto = require('crypto');

const app = express();
const port = 5000;
// Add this line to serve our index.html page
app.use(express.static('public'));
app.use('/upload', express.static('upload'));
var corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
app.use(
    fileUpload({
        limits: {
            fileSize: 100000000, // Around 10MB
        },
        abortOnLimit: true,
    })
);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/upload', (req, res) => {
    console.log("upload")
    const { image } = req.files;
    console.log(req.files)
    if (!image) return res.sendStatus(400);
    console.log("after check "+ image.mimetype)
    console.log("check ", /^image/.test(image.mimetype))
    // If does not have image mime type prevent from uploading
    if (/^image/.test(image.mimetype)==false) return res.sendStatus(400);
    console.log("before mv")
    var fileExt = image.name.split('.').pop();
    image.name = crypto.randomUUID()+'.'+fileExt;
    image.mv(__dirname + '/upload/' + image.name);
    console.log("after mv")
    res.status(200).json({
        error:false,
        message:"success uploaded",
        path:image.name
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


//https://pqina.nl/blog/upload-image-with-nodejs/
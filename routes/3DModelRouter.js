require('dotenv').config();
const router = require('express').Router()
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const URI = process.env.MONGO_URL
const conn = mongoose.createConnection(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let gfs;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: '3dmodels',
    });
});

const storage = new GridFsStorage({
    url: URI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        // this function runs every time a new file is created
        return new Promise((resolve, reject) => {
            // use the crypto package to generate some random hex bytes
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                // turn the random bytes into a string and add the file extention at the end of it (.png or .jpg)
                // this way our file names will not collide if someone uploads the same file twice
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: '3dmodels',
                };
                // resolve these properties so they will be added to the new file document
                resolve(fileInfo);
            });
        });
    },
});

// set up our multer to use the gridfs storage defined above
const store = multer({
    storage,
    // limit the size to 100mb for any files coming in
    limits: { fileSize: 100000000 },
    // filer out invalid filetypes
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    // https://youtu.be/9Qzmri1WaaE?t=1515
    // define a regex that includes the file types we accept
    const filetypes = /jpeg|jpg|png|gif|glb|gltf|zip/;
    //check the file extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // more importantly, check the mimetype
    const mimetype = filetypes.test(file.mimetype);
    // if both are good then continue
    if (mimetype && extname) return cb(null, true);
    // otherwise, return error message
    cb('filetype');
}

const uploadMiddleware = (req, res, next) => {
    const upload = store.single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ msg: 'File too large' });
        } else if (err) {
            // check if our filetype error occurred
            if (err === 'filetype') return res.status(400).json({ msg: 'Image and GLTF/GLB files only' });
            // An unknown error occurred when uploading.
            return res.sendStatus(500);
        }
        // all good, proceed
        next();
    });
};

router.get("/3dmodel", async (req, res) => {
    try {
        res.json({
            status: 200,
            message: "Get data has successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

router.post('/3dmodel/', uploadMiddleware, async (req, res) => {
    // get the .file property from req that was added by the upload middleware
    const { file } = req;
    // and the id of that new image file
    const { id } = file;
    // we can set other, smaller file size limits on routes that use the upload middleware
    // set this and the multer file size limit to whatever fits your project
    if (file.size > 100000000) {
        // if the file is too large, delete it and send an error
        deleteImage(id, res);
        return res.status(400).json({ msg: 'file may not exceed 100mb' });
    }
    console.log('uploaded file: ', file);
    return res.json({ file_id: file.id });
});

const deleteImage = (id, res) => {
    if (!id || id === 'undefined') return res.status(400).json({ msg: 'no image id' });
    const _id = new mongoose.Types.ObjectId(id);
    gfs.delete(_id, (err) => {
        if (err) return res.status(500).json({ msg: 'image deletion error' });
    });
};

router.delete('/3dmodel/:id', async ({ params: { id } }, res) => {
    deleteImage(id, res)
    return res.status(200).json({ msg: "Delete model successfully." })
})

// this route will be accessed by any img tags on the front end which have
// src tags like
// <img src="/api/image/123456789" alt="example"/>
// <img src={`/api/image/${user.profilePic}`} alt="example"/>
router.get('/3dmodel/:id', ({ params: { id } }, res) => {
    // if no id return error
    if (!id || id === 'undefined') return res.status(400).json({ msg: 'no file id' });
    // if there is an id string, cast it to mongoose's objectId type
    const _id = new mongoose.Types.ObjectId(id);
    // search for the image by id
    gfs.find({ _id }).toArray((err, files) => {
        if (!files || files.length === 0)
            return res.status(400).json({ msg: 'no files exist' });
        // if a file exists, send the data
        gfs.openDownloadStream(_id).pipe(res);
    });
});

module.exports = router;
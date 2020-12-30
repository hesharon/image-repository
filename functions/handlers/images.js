const { admin, db } = require("../util/admin");
const config = require('../util/config')
const e = require("express");

exports.getAllImages = (req, res) => {
    db.collection('images')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let images = []
        data.forEach(doc => {
            images.push({
                imageId: doc.id,
                imageUrl: doc.data().url,
                createdAt: doc.data().createdAt
            })
        })
        return res.json(images)
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({error: err.code})
    })
}

exports.postImage = (req, res) => {
    const BusBoy = require('busboy')
    const path = require("path")
    const os = require("os")
    const fs = require("fs")

    const busboy = new BusBoy({ headers: req.headers });

    let files = [], buffers = {}

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
        }
        buffers[fieldname] = []
        file.on('data', data => {
            buffers[fieldname].push(data)
        })

        file.on('end', () => {
            const imageExtension = filename.split(".")[filename.split(".").length - 1]
            const imageFileName = `${Math.round(Math.random() * 10000)}.${imageExtension}`
            const filepath = path.join(os.tmpdir(), imageFileName)
            files.push({
                fileBuffer: Buffer.concat(buffers[fieldname]),
                encoding,
                imageFileName,
                imageToBeUploaded: { filepath, mimetype }
            })
            file.pipe(fs.createWriteStream(filepath))
        })
    })

    busboy.on("finish", () => {
        files.map(file => {
            admin
            .storage()
            .bucket()
            .upload(file.imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                metadata: {
                    contentType: file.imageToBeUploaded.mimetype,
                },
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${file.imageFileName}?alt=media`;
                return db.collection('images').add({
                    userHandle: req.user.handle,
                    url: imageUrl,
                    createdAt: new Date().toISOString()
                })
            })
            .then(() => {
                return res.json({ message: "Images uploaded successfully" });
            })
            .catch((err) => {
                console.error(err)
                return res.status(500).json({ error: err.code })
            })
        })
     })
    busboy.end(req.rawBody);
}
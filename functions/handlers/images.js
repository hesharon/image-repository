const { db } = require("../util/admin");
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
const functions = require('firebase-functions')

const app = require("express")()

const { db } = require("./util/admin")

const FbAuth = require("./util/FbAuth")
const express = require('express')

const cors = require("cors")
app.use(cors({ origin: true }))
app.use(express.json({limit: '150mb'}))
app.use(express.urlencoded({limit: '150mb'}))

const {
   getAllImages,
    postImages,
    postImage,
//    deleteImages,
//    deleteImage
} = require('./handlers/images')

 const {
     signup,
     login,
     getAuthenticatedUser
 } = require('./handlers/users')

 // Image routes
app.get('/images', getAllImages)
app.post('/image',FbAuth, postImage)
app.post('/images', postImages)

// User routes
app.post('/signup', signup)
app.post("/login", login)

exports.api = functions.region("northamerica-northeast1").https.onRequest(app);



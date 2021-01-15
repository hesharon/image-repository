const functions = require('firebase-functions')
const express = require("express")
const app = express()
const { db } = require("./util/admin")
const FbAuth = require("./util/FbAuth")
const cors = require("cors")

app.use(cors({ origin: true }))

const {
    getAllImages,
   getAllMyImages,
    postImages,
    setPrivacy,
//    deleteImages,
//    deleteImage
} = require('./handlers/images')

 const {
     signup,
     login,
     getAuthenticatedUser
 } = require('./handlers/users')

 // Image routes
app.get('/my-images', FbAuth, getAllMyImages)
app.get('/images', getAllImages)
app.post('/images',FbAuth, postImages)
app.post('/privacy', FbAuth, setPrivacy)

// User routes
app.post('/signup', signup)
app.post("/login", login)

exports.api = functions.region("northamerica-northeast1").https.onRequest(app);



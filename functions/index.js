const functions = require('firebase-functions');

const app = require("express")();

const { db } = require("./util/admin");

const cors = require("cors");
app.use(cors({ origin: true }));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {
   getAllImages,
//    postImages,
//    postImage,
//    deleteImages,
//    deleteImage
} = require('./handlers/images')

// const {
//     signup,
//     login,
//     getAuthenticatedUser
// } = require('./handlers/users')

app.get('/images', getAllImages)

exports.api = functions.region("northamerica-northeast1").https.onRequest(app);



///// Module to Upload files in AWS Cloud

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    // create an instance of an aws3 user
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    // defined a function to upload to s3 and use it in our server.js
    if (!req.file) {
        // if there is no file send status code
        console.log("there is no file passed to s3.js");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file; // extracts extra info from file object

    const promise = s3
        .putObject({
            // allows us to upload image to AWS
            Bucket: "imagebucket-adobo", // UPDATE: change to the name of your AWS bucket, adobo-imageboard is name of my bucket
            ACL: "public-read", // Access Control List, file is not provate, view is set public
            Key: filename, // pass file name
            Body: fs.createReadStream(path), // pass file path
            ContentType: mimetype, // mimetype is type of file
            ContentLength: size, //size of file
        })
        .promise(); // request is an asynchronous procosess, so it requires a promise

    promise
        .then(() => {
            // it worked!!! // ✅
            console.log("AWS upload complete!!!");
            fs.unlink(path, () => {}); // optional: deletes file in uploads folder once successfully uploaded
            next(); // to make sure we get out of this middleware and move to the next middleware in server.js
            // -> i.e. to s3.upload app.post("upload", uploader.single("file"), s3.upload, (req, res) => {
        })
        .catch((err) => {
            // uh oh // ❌
            console.log(err);
        });
};

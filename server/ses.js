/// SES EMAIL SERVICE
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    // Frankfurt eu-central-1
    region: "eu-central-1",
});

exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            Source: "BREWLER <aleksej.trubnikov@gmail.com>", // where is the email comingform
            Destination: {
                ToAddresses: [recipient], // who we are sending the email to?, set to an array from 'disco.duck@spiced.academy'
            },
            Message: {
                Body: {
                    Text: {
                        Data: message, // message variable will be passed here contianing the email message
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("[ses.js]: sendEmail executed successful!"))
        .catch((err) => console.log(err));
};

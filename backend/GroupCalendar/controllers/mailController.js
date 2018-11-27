var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "groupcalendar.talkingcode@gmail.com",
        pass: "secretpw=ZZJ321"
    }
});

function getMailInfo(receiver) {
    return {
        from: "Group Calendar <groupcalendar.talkingcode@gmail.com>",
        to: `${receiver}`,
        subject: "Send Email Using Node.js",
        text: "hi",
        html: "<b>get email</b>"
    }
}

function sendEmail(receiver) {
    smtpTransport.sendMail(getMailInfo(receiver), function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
}

module.exports = sendEmail;
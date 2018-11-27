var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport(
    {
    service: "Gmail",
    auth: {
        user: "groupcalendar.talkingcode@gmail.com",
        pass: "secretpw=ZZJ321"
    }
});

function getMailInfo(receiver, subject, text, html) {
    return {
        from: "Group Calendar <groupcalendar.talkingcode@gmail.com>",
        to: `${receiver}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${html}`,
    }
}

function sendEmail(receiver, subject, text, html) {
    smtpTransport.sendMail(getMailInfo(receiver, subject, text, html), function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
}

module.exports = {sendEmail};
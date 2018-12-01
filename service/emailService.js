const logger = require('../libs/logger');
const nodemailer = require('nodemailer');
const resolveErrorType = require('../error').resolveErrorType;
const conf = require('../configuration/configuration');

const sendEmail = (from, message) => {
    const validationErrors = validate(from, message);

    const mailOptions = {
        to: conf.email.to,
        from,
        subject: conf.email.title,
        text: message,
        replyTo: from
    };

    logger.debug('mail options: \n', JSON.stringify(mailOptions, null, 2));

    if (validationErrors.length > 0) {
        return Promise.reject(resolveErrorType({name: 'ValidationError', errors: validationErrors}));
    } else {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    logger.debug(error);
                    reject(error);
                } else {
                    logger.debug('Message sent. \n', response);
                    resolve(response);
                }
            });
        });
    }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    provider: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: conf.email_server.username,
        pass: conf.email_server.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const validate = (from, message) => {
    let errors = [];

    if (!validateEmail(from)) {
        errors.push({field: 'from', message: 'Invalid sender email.'})
    }

    if (!message || message.trim() === '') {
        errors.push({field: 'message', message: 'Message can\'t be empty'})
    }

    return errors;
};

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return re.test(email);
};


module.exports = sendEmail;
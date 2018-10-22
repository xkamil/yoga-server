const logger = require('../utils').getLogger();
const nodemailer = require('nodemailer');
const resolveErrorType = require('../error').resolveErrorType;

function EmailService(username, password) {
    this.to = username;

    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        provider: 'gmail',
        port: 465,
        secure: true,
        auth: {user: username, pass: password},
        tls: {
            rejectUnauthorized: false
        }
    });

}

EmailService.prototype.sendEmail = function (from, to, message, title) {
    const validationErrors = this._validate(from, message);

    const mailOptions = {
        to,
        from,
        subject: title,
        text: message,
        replyTo: from
    };

    if (validationErrors.length > 0) {
        return Promise.reject(resolveErrorType({name: 'ValidationError', errors: validationErrors}));
    } else {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, function (error, response) {
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

EmailService.prototype._validate = function (from, to,  message) {
    let errors = [];

    if (!this._validateEmail(from)) {
        errors.push({field: 'from', message: 'Invalid sender email.'})
    }

    if (!this._validateEmail(to)) {
        errors.push({field: 'to', message: 'Invalid receiver email.'})
    }

    if (!this._validateMessage(message)) {
        errors.push({field: 'message', message: 'Message can\'t be empty'})
    }

    return errors;
};

EmailService.prototype._validateEmail = function (email) {
    const re = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return re.test(email);
};

EmailService.prototype._validateMessage = function (message) {
    return message && message.trim() !== ''
};

module.exports = EmailService;
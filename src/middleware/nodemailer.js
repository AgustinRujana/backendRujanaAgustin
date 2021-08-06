import nodemailer from 'nodemailer'

import config from '../../config.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD
    }
})

export const sendEmail = (from, subject, message, to, cb) => {
    const Options = {
        from: from,
        to: to,
        subject: subject,
        html: message,
    }

    transport.sendMail(Options, (error, info) => {
        console.log(`Error to send email: ${error}`)
        cb(error, info)
    })
}
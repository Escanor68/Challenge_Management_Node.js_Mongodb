const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_TO_SEND,
		pass: process.env.PASS_OF_EMAIL_TO_SEND
	}
});

class SendEmail {
	static async send(to, subject, texto) {
		try {
			const envioMail = await transporter.sendMail({
				from: process.env.EMAIL_TO_SEND,
				to,
				subject,
				texto
			});
			return envioMail;
		} catch(error) {
			return error;
		}
	}
}
module.exports = SendEmail;

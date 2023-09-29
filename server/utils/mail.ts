import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

interface emailOptions {
	email: string;
	subject: string;
	template: string;
	data: { [key: string]: any };
}

const sendMail = async (options: emailOptions): Promise<void> => {
	const transporter: Transporter = nodemailer.createTransport({
		service: 'mandrillapp',
		host: process.env.SENDINBLUE_HOST,
		port: parseInt(process.env.SENDINBLUE_PORT || '587'),
		auth: {
			user: process.env.SENDINBLUE_USERNAME,
			pass: process.env.SENDINBLUE_PASSWORD,
		},
	});

	const { email, subject, template, data } = options;

	// get template path
	const templatePath = path.join(__dirname, `../mails/${template}`);

	// render email template with ejs
	const html = await ejs.renderFile(templatePath, data);

	const emailOptions = {
		from: `Mohamed Shebl <${process.env.SENDINBLUE_EMAIL}>`,
		to: email,
		subject,
		html,
	};

	await transporter.sendMail(emailOptions);
};

export default sendMail;

let nodemailer = require('nodemailer');
let config = require('config-lite');
console.log(config)
module.exports = function (config) {
	// let mailTransport = nodemailer.createTransport('smtps://' + config.gmail.user + '%40gmail.com:' + config.gmail.password + '@smtp.gmail.com');
	let mailTransport = nodemailer.createTransport({
		service: '163',
		auth: {
			user: config.email.user,
			pass: config.email.pass
		}
	})
	let fm = 'ervinblog@163.com';
	return {
		send: function(option, cb){
			mailTransport.sendMail({
				from: fm,
				to: option.to,
				subject: option.subject,
				html: option.html,
				generateTextFromHtml: true
				}, function(err, info){
					cb(err, info);
				});
		},
		emailError: function(message, filename, exception){
			let body = '<h1>Meadowlark Travel Site Error</h1>';
				body += 'message:<br><pre>' + message + '</pre><br>';
			if(exception){
				body += 'exception:<br><pre>' + exception + '</pre><br>';
			}
			if(filename){
				body += 'filename:<br><pre>' + filename + '</pre><br>';
			} 
			
			mailTransport.sendMail({
				from: from,
				to: errorRecipient,
				subject: 'Meadowlark Travel Site Error',
				html: body,
				generateTextFromHtml: true
				}, function(err){
					if(err){
						console.error('Unable to send email: ' + err);
					} 
				}
			);
		}
	}
};
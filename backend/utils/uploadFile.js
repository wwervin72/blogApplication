let fs = require('fs');
let path = require('path');
let formidable = require('formidable');
let server = 'localhost:3000';
let uploadFolderName = 'upload';
let uploadFolderPath = path.join(__dirname + '/../public', uploadFolderName);

module.exports = {
	upload: function (req, res, next) {
		let form = new formidable.IncomingForm(), 
					prop, file, tempFilePath, fileNewPath, type, fileName, extName;
			form.uploadDir = "./temp";
		form.parse(req, function (err, fields, files) {
			if(err){
				return next(err);
			}
			if(!Object.keys(files).length){
				return res.status(200).json({
					result: false,
					msg: '请选择上传文件'
				});
			}
			for(prop in files){
				file = files[prop];
				tempFilePath = file.path;
				type = file.type;
				// 获取文件名，并根据文件名获取扩展名
				fileName = file.name;
				extName = fileName.lastIndexOf('.') >= 0
								? fileName.slice(fileName.lastIndexOf('.') - fileName.length)
								: '';
				// 文件名没有扩展名时候，则从文件类型中取扩展名
				if (extName === '' && type.indexOf('/') >= 0) {
					extName = '.' + type.split('/')[1];
				}
				// 将文件名重新赋值为一个随机数（避免文件重名）
				fileName = Math.random().toString().slice(2) + extName;

				// 构建将要存储的文件的路径
				var fileNewPath = path.join(uploadFolderPath, fileName);
				fs.rename(tempFilePath, fileNewPath, function (err) {
					if(err){
						return next(err);
					}
					res.status(200).end('http://' + server + '/' + uploadFolderName + '/' + fileName);
				});
			}
		});
	}
}
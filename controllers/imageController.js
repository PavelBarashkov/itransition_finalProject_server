require('dotenv').config();
const formidable = require('formidable');
const { Image } = require('../models/models');
const ApiError = require('../error/ApiError');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY__NAME,
    api_key: process.env.CLOUDINARY__KEY,
    api_secret: process.env.CLOUDINARY__SECRET
  });

class ImageController {
    async upload(req, res, next) {
        const form = formidable({ multiples: true });
        try {
            form.parse(req, (err, fields, files) => {
                const result =  cloudinary.uploader.upload(files.file.filepath);
                result.then(async (data) => {
                  console.log(data);
                  console.log(data.secure_url);
                  const img = await Image.create({
                      nameFile: data.original_filename,
                      pathToCloudStorage: data.secure_url
                  });
                  return res.json({data: {
                    id: img.id,
                    name: img.nameFile,
                    url: img.pathToCloudStorage
                  }})
                }).catch((err) => {
                    return next(ApiError.badRequest(err.message));
                });
              });
        } catch (e) {
            return next(ApiError.badRequest('не удалось загрузить изображение'));
        }
       

    }

    async imageUploadId(req, res) {

    }
}

module.exports = new ImageController();

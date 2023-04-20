const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'duy8ow4xu',
    api_key: '785782973637515',
    api_secret: 'ddjddnmJ0Iz7U0fzhW9x9ZtQZKU',
});

class ImageController {
    
    async imageUpload(req, res) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            res.send(result);
        } catch(e) {
            console.log(e)
        }
    }
    
    async imageUploadId(req, res) {
        
    }

}

module.exports = new ImageController();
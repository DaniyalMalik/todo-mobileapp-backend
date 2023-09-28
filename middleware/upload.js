const multer = require('multer'),
  dotenv = require('dotenv'),
  { GridFsStorage } = require('multer-gridfs-storage');

dotenv.config({ path: 'config/config.env' });

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg', 'image/gif'];

    if (match.indexOf(file.mimetype) === -1) {
      throw new Error('Uploaded file type is not allowed!');
    }

    return {
      bucketName: 'images',
      filename: `${Date.now()}-any-name-${file.originalname}`,
    };
  },
});

module.exports = multer({ storage });

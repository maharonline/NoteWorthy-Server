import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Uploading file to temp folder:', file.originalname);  
    cb(null, './public/temp'); // Temporary storage for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null,Math.random().toString(36).slice(2) + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

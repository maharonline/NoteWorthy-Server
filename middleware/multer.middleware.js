// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log('Uploading file to temp folder:', file.originalname);  
//     cb(null, './public/temp'); // Temporary storage for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null,Math.random().toString(36).slice(2) + '-' + file.originalname);
//   },
// });

// export const upload = multer({ storage });


import multer from "multer";
import fs from "fs";

// Ensure `./public/temp` folder exists
const uploadPath = "./public/temp";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Uploading file to temp folder:", file.originalname);
    cb(null, uploadPath); // Now guaranteed to exist
  },
  filename: function (req, file, cb) {
    const uniqueName = Math.random().toString(36).slice(2) + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

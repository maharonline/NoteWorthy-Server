import { v2 as Cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from "dotenv";

dotenv.config();

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadOnCloudinary=async(localFilePath)=>{
    try{
        const response=await Cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto",folder:"NoteWorthy"
        })

        console.log("File Path:",response.secure_url);
        
        fs.unlinkSync(localFilePath)
        return response.secure_url
}
    catch(error){
        fs.unlinkSync(localFilePath)
        console.error('Cloudinary Upload Error:', error);
        throw error;    
    }

}

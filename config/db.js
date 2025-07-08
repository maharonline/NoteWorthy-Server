import mongoose from "mongoose";

const connectDb=()=>{
    try {
        mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    });
        console.log("MongoDb is Connected Successfully");
        
    } catch (error) {
        console.log("Something Went Wrong While Connecting MongoDB");
        
    }
}

export default connectDb
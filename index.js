import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://note-worthy-client.vercel.app",
  credentials: true
}));
app.use(cookieParser())


//Mogo Db Connection 
connectDb()

import auth from './routes/auth.routes.js';
import note from './routes/notes.routes.js';
// import course from './routes/course.routes.js';
import subject from './routes/subject.routes.js';
// import semester from './routes/semester.routes.js';
import teacher from './routes/teacher.routes.js';
import admin from './routes/admin.routes.js';
import favourite from './routes/favourite.routes.js';
import download from './routes/download.routes.js';
import feedback from './routes/feedback.routes.js';
import frontend from './routes/frontend.routes.js';


// app.use("/api/course",course)
// app.use("/api/semester",semester)
app.use("/api/auth",auth)
app.use("/api/notes",note)
app.use("/api/subject",subject)
app.use("/api/teacher",teacher)
app.use("/api/admin",admin)
app.use("/api/favourite",favourite)
app.use("/api/download",download)
app.use("/api/feedback",feedback)
app.use("/api/frontend",frontend)

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log("Server is Running At",PORT);
})

// import { Semester } from "../models/semester.js";

export const createSemester=async (req, res) => {
  const { number, course, subject } = req.body;
  try {
    const semester = new Semester({ number, course, subject })
    await semester.save()
    res.status(200).json({ message: "Semester Added" })
  } catch (error) {
    console.log("Semester Error", error);

  }
}

export const getSemester=async(req,res)=>{
  const { semesterNumber } = req.query;
  try {
    const semester=await Semester.findOne({number:semesterNumber})
    res.status(201).json(semester)
    // console.log(semester);
    
  } catch (error) {
    console.log("GEtting Semester Error",error);
    res.status(501).json({message:"Getting Semester Error"})
    
  }
}


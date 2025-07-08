// import { Course } from "../models/course.js";
// import { Semester } from "../models/semester.js";


export const createCourse = async (req, res) => {
  const { title, numberofsemester } = req.body;

  try {

    let course = await Course.findOne({ title });

    if (course) {
      return res.status(400).json({ message: "Course Already Exist" })
    }
    course = new Course({ title })
    await course.save()

    const newCourse = await Course.findOne({ title });
    

    const semesters=[]
    for (let index = 1; index <= numberofsemester; index++) {
     const semester=new Semester({number:index,course:newCourse._id})
     await semester.save()
     semesters.push(semester)
      
    }
    res.status(201).json({course:newCourse,semesters,message: "Course Added Successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }

};

// export const getCourse=async(req,res)=>{
//   const{courseId}=req.body
//   try {
//     const course=await Course.findById({_id:courseId})
//     if(!course){return res.status(409).json({message:"There is No Course"})}
//     res.status(200).json({course})
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "An error occurred while processing the request." });
//   }
// }


export const deleteCourse=async(req,res)=>{
  const {courseId}=req.body
  try {
    const course=await Course.findByIdAndDelete({_id:courseId})
    const semester=await Semester.deleteMany({course:courseId})
    res.status(200).json({message:"All Courese and its All Semester is Deleted",})
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}


export const getCourse= async (req, res) => {
  try {
    const { title } = req.query; // Extract title from query params


    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const course = await Course.findOne({ title });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
    console.log(course);
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

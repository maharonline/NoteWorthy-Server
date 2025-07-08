import { Note } from "../models/notes.js";
// import { Semester } from "../models/semester.js";
import { Subject } from "../models/subject.js";

// export const createSubject = async (req, res) => {
//   const { title, semesterId } = req.body;

//   try {
//     const subject = await Subject.create({ title });

//     const semesterData = await Semester.findById(semesterId);

//     if (semesterData) {
//       semesterData.subjects.push(subject._id);
//       await semesterData.save();
//     }
//     res.status(200).json({ subject, message: "Subject Added" });
//   } catch (error) {
//     console.log("Subject Error", error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// };
export const createSubject = async (req, res) => {
  const {title,subjectTitle, semesterId } = req.body;

  try {
    const subject = await Subject.create({ title });

    
    res.status(200).json({ subject, message: "Subject Added" });
  } catch (error) {
    console.log("Subject Error", error);
    res.status(500).json({ message: "An error occurred" });
  }
};


// export const getSubject=async(req,res)=>{
//   const {subjectId}=req.body
//   const subject=await Subject.findById({_id:subjectId})
//   if(!subject){return res.status(409).json({message:"There is no subject"})}
//   res.status(200).json(subject.notes)
// }
export const getSubject = async (req, res) => {
  try{

    const subject = await Subject.find()
    if (!subject) { return res.status(409).json({ message: "There is no subject" }) }
    res.status(200).json(subject)
  }catch(error){
    console.error(error)
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}


//This Qurey Work on Deleted Subjects and Notes of that subjext
// @api subject/delete
// @desc delete a subject


export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject Not Found For Deletion",
        error: true,
      });
    }

    // ✅ Delete all related notes
    await Note.deleteMany({ _id: { $in: subject.notes } });

    // ✅ Now delete the subject
    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "The Subject and its all Notes have been deleted." });

  } catch (error) {
    console.error("Error deleting subject and notes:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

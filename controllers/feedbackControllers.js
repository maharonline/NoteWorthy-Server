import { Feedbacks } from "../models/feedbacksModel.js";

export const createFeedBack=async(req,res)=>{
const{noteId,userId,feedback,userModel}=req.body;
try {
    await Feedbacks.create(({noteId,userId,feedback,userModel}))
    res.status(201).json({message:"Your FeedBack is Submitted successfully",success:true})
} catch (error) {
    res.status(500).json({message:"Something Went Wrong While Adding feedback",error})
    console.log(error);
    
}
}

export const getFeedBack=async(req,res)=>{
    
   try {
    const feedbacks = await Feedbacks.find({ userId: req.params.userId }).populate("noteId", "title").populate("userId", "userName photoURL");
    // const mapped = feedbacks.map(f => ({
    //   _id: f._id,
    //   feedback: f.feedback,
    //   createdAt: f.createdAt,
    //   noteTitle: f.noteId?.title ,
    // }));
     const mapped = feedbacks.map(f => ({
      _id: f._id,
      feedback: f.feedback,
      createdAt: f.createdAt,
      noteTitle: f.noteId?.title,
      user: {
        userName: f.userId?.userName || "Unknown",
        photoURL: f.userId?.photoURL || "",
        _id: f.userId?._id,
      }
    }));
    res.status(200).json({ feedbacks: mapped });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
    console.log(err)
  }
}


export const updateFeedback=async(req,res)=>{
  const{editedText}=req.body;

  try {
    const searchFeedback=await Feedbacks.findById(req.params.id)
    console.log(req.params._id);
    
    if(!searchFeedback){return res.status(409).json({message:"There is Not A FeedBack"})}
    
    searchFeedback.feedback=editedText
     await searchFeedback.save(); // save the updated document

    return res.status(200).json({ message: "Feedback updated successfully", searchFeedback ,success:true});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error",error:true });
  }
}

// export const deleteFeedback=async(req,res)=>{
//   console.log(req.params.id)
//   try {
//     const deleteFeedback=await Feedbacks.findByIdAndDelete(req.params.id)
//     if(!deleteFeedback){return res.status(409).json({message:"Feedback Not Found For Deletion",error:true})}
//     res.staus(200).json({message:"Your FeedBack is Deleted",success:true})
//   } catch (error) {
//     console.log("Deletion Error",error);
    
//     return res.status(500).json({ message: "Server error",error:true });
//   }
// }

export const deleteFeedback = async (req, res) => {
  

  try {
    const deletedFeedback = await Feedbacks.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(409).json({
        message: "Feedback Not Found For Deletion",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Your Feedback is Deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error during deletion:", error);
    return res.status(500).json({
      message: "Server error",
      error: true,
    });
  }
};


// export const getAllFeedbacks=async(req,res)=>{
//   try {
//     const allFeedbacks=await Feedbacks.find().populate("noteId", "title").populate("userId", "userName photoURL").sort({ createdAt: -1 }); // latest first
//     return res.status(200).json({allFeedbacks,success:true})
//   } catch (error) {
//    return res.status(501).json({message:"Something Went Wrong While Getting All FeedBacks",success:false})
//    console.log(error);
   
//   }
// }
export const getAllFeedbacks = async (req, res) => {
  try {
    const allFeedbacks = await Feedbacks.find()
      .populate("noteId", "title")
      .populate("userId", "userName photoURL") // ye line cause ho sakti
      .sort({ createdAt: -1 });

    return res.status(200).json({ allFeedbacks, success: true });
  } catch (error) {
    console.log("Feedback error:", error); // ✅ Add this line
    return res.status(501).json({
      message: "Something Went Wrong While Getting All FeedBacks",
      success: false,
    });
  }
};


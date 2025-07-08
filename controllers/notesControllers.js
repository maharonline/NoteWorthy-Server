import { Note } from "../models/notes.js"
import { Subject } from "../models/subject.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createNoteonsubjecttilte = async (req, res) => {
  const { title, category, subjectTitle, userId } = req.body;
  console.log("Form Data:", req.body);

  try {
    let subjectDoc = await Subject.findOne({ title: subjectTitle });
    if (!subjectDoc) {
      subjectDoc = await Subject.create({title: subjectTitle,notes: []});
    }

    let cloudinaryUrl = null;

    if (req.file) {
      const localFilePath = req.file.path;
      cloudinaryUrl = await uploadOnCloudinary(localFilePath);
    }

    const note = await Note.create({
      title,
      category,
      subject: subjectDoc._id,
      fileUrl: cloudinaryUrl,
      uploadedBy: userId,
    });

    subjectDoc.notes.push(note._id);
    await subjectDoc.save();

    res.status(201).json({ note, message: "Notes Created" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const getNotes = async (req, res) => {
  const { id } = req.query;

  try {
    const subjectDoc = await Subject.findOne({ _id: id });
    if (!subjectDoc) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const notes = await Note.find({ subject: subjectDoc._id });
    res.status(200).json(notes); // send directly as array
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

export const getNotesByUserId = async (req, res) => {
  try {

    const notes = await Note.find({ uploadedBy: req.params.userId })
      .populate("subject", "title")
      .sort({ createdAt: -1 });

    const formattedNotes = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      category: note.category,
      fileUrl: note.fileUrl,
      createdAt: note.createdAt,
      subjectTitle: note.subject?.title || "N/A",
    }));

    res.status(200).json({ success: true, notes: formattedNotes });
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const deleteNotes = async (req, res) => {
  const { id } = req.body;
  try {
    const note = await Note.findByIdAndDelete(req.params.id)
    if (!note) {
      return res.status(409).json({
        message: "Note Not Found For Deletion",
        error: true,
      });
    }

     return res.status(200).json({
      message: "Note is Deleted",
      success: true,
    });
  }
  catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." })
  }
}



export const getNotesUploadedByTeacher = async (req, res) => {
  const { uploadedBy } = req.query;

  try {
    const allNotes = await Note.find({ uploadedBy });

    const now = new Date();
    const monthsToShow = [];

    // Last 3 months (including current)
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsToShow.push(key);
    }

    // Count per month
    const monthCounts = {};

    allNotes.forEach((note) => {
      const date = new Date(note.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthsToShow.includes(key)) {
        monthCounts[key] = (monthCounts[key] || 0) + 1;
      }
    });

    // Format monthly summary
    const summary = monthsToShow.map((key) => {
      const [year, month] = key.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "short",
      });
      return {
        month: monthName,
        notes: monthCounts[key] || 0,  // 👈 changed 'uploads' → 'notes'
      };
    });

    // Recent notes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentDownload = allNotes.filter(note => new Date(note.createdAt) >= sevenDaysAgo);

    res.status(200).json({
      success: true,
      totalCount: allNotes.length,
      summary,                // 👉 for chart
      recentDownload,         // 👉 for recent table
    });

  } catch (error) {
    console.error("Error in getNotesUploadedByTeacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

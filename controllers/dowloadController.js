import moment from 'moment';
import { Download } from "../models/dowloadModel.js";

export const dowloadDetail = async (req, res) => {
    const { noteId, userId } = req.body;

    console.log("NoteId:",noteId)
    try {
        await Download.create({ noteId, userId });
        res.status(200).json({ message: "Download recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving download record" });
        console.log(error);

    }
}


export const getDownloadSummary = async (req, res) => {
  const { userId } = req.query;

  try {
    const allDownloads = await Download.find({ userId })

    const now = new Date();
    const monthsToShow = [];

    // Get last 3 months including current
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsToShow.push(key);
    }

    //Recent Download
    const sevenDaysAgo = new Date();
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDownloads = allDownloads.filter(download =>
      new Date(download.createdAt) >= sevenDaysAgo
    );
    // Count per month
    const monthCounts = {};

    allDownloads.forEach((d) => {
      const date = new Date(d.downloadedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthsToShow.includes(key)) {
        monthCounts[key] = (monthCounts[key] || 0) + 1;
      }
    });

    // Format response
    const summary = monthsToShow.map((key) => {
      const [year, month] = key.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "short",
      });
      return {
        month: monthName,
        downloads: monthCounts[key] || 0,
      };
    });

    res.status(200).json({
      success: true,
      totalCount: allDownloads.length,
      summary, 
      
      downloads: allDownloads, 
      recentCount:recentDownloads.length
    });
  } catch (error) {
    console.error("Error in getDownloadSummary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const recentDownloadSubject = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const recentDownload = await Download.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "noteId",
        populate: {
          path: "subject", // make sure this matches your Note schema
          model: "Subject",  // name of your Subject model
        },
      });

    res.status(200).json({
      success: true,
      recentDownload: recentDownload
        .filter(d => d.noteId && d.noteId.subject)
        .map(d => ({
          _id: d._id,
          noteId: d.noteId._id,
          title: d.noteId.title,
          subjectTitle: d.noteId.subject.title || "N/A",
        })),
    });
  } catch (error) {
    console.error("Error fetching RecentDownload:", error);
    res.status(500).json({ error: true, message: "Server Error" });
  }
};

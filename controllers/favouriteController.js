import mongoose from 'mongoose';
import{Favourite} from '../models/favouriteModel.js'

export const addFavourite= async (req, res) => {
    try {
      const { noteId,userId,title,fileUrl } = req.body;
      
  
      const existing = await Favourite.findOne({
        userId,
        noteId,
       
      });
  
      if (existing) {
        return res.status(400).json({ message: 'Already Favourited' });
      }
  
      const fav = new Favourite({
        userId,
        noteId,
        title,
        fileUrl
      });
  
      await fav.save();
      res.status(200).json({ message: 'Added to favourites',success:true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error',success:false });
    }
  };
  


//  export const getFavourite= async (req, res) => {
//     try {
//       const userId = req.params.userId;
  
//       const favorites = await Favourite.find({ userId }).populate('noteId');
  
//       res.status(200).json({
//         success: true,
//         favorites: favorites.map(fav => ({
//           _id: fav._id,
//           noteId: fav.noteId._id,
//           title: fav.noteId.title,
//           fileUrl: fav.noteId.fileUrl
//         })),
//         count: favorites.length
//       });
//     } catch (error) {
//       console.error('Error fetching favorites:', error);
//       res.status(500).json({ error: true, message: 'Server Error' });
//     }
//   };

export const getFavourite = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing user ID' });
    }

    const favorites = await Favourite.find({ userId }).populate('noteId');

    // Filter null noteIds (e.g. if note is deleted)
    const safeFavorites = favorites
      .filter(fav => fav.noteId !== null)
      .map(fav => ({
        _id: fav._id,
        noteId: fav.noteId._id,
        title: fav.noteId.title,
        fileUrl: fav.noteId.fileUrl,
        subjectTitle: fav.noteId.subjectTitle || "", // optional
      }));

    res.status(200).json({
      success: true,
      favorites: safeFavorites,
      count: safeFavorites.length
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: true, message: 'Server Error' });
  }
};


export const deleteFavourite=async(req,res)=>{
  try {
   

const { id } = req.params;

if (!mongoose.Types.ObjectId.isValid(id)) {

  return res.status(400).json({ message: "Invalid ID", success: false });
}

const deletedItem = await Favourite.findByIdAndDelete(id);

if (!deletedItem) {
  return res.status(404).json({ message: "Item not found", success: false });
}

res.status(200).json({ message: "Removed Successfully", success: true });

  } catch (error) {
    console.log("Deletion Favourite Error",error);
    res.status(501).json({message:"Server Error",success:false})
    
  }
}

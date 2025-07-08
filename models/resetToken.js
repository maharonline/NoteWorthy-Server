import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"


const resetTokenModel=new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "ownerModel", // Dynamic reference
        required: true
    },
    ownerModel: {
        type: String,
        enum: ["auth", "teacher"], // Define allowed models
        required: true
    },
    token:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        expires:3600,
        default:Date.now()

    }
})

resetTokenModel.pre("save", async function (next) {
    if (this.isModified("token")) {
        this.token = await bcrypt.hash(this.token, 10);
    }
    next();
});

// Method for comparing hashed tokens
resetTokenModel.methods.compareToken = async function (token) {
    return await bcrypt.compare(token, this.token);
};
export const ResetToken = mongoose.model("resetTokenModel", resetTokenModel)
const Profile=require("../models/Profile")
const User=require("../models/User");

//update profile 
exports.updateProfile=async(req,res)=>{
    try {
        //get data 
        const {dateOfBirth="",about="",contactNumber,gender}=req.body
        //get user id 
        const id=req.user.id;
        //validation 
        if(!contactNumber||!gender||!id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //find profile 
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        //update profile
        profileDetails.dateofBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        //res return 
        return res.status(200).json({
            success:true,
            message:"profile update successfully",
            profileDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Fail to update the profile ",
            error:error.message,
        })
    }
}

//delete Account

exports.deleteAccount=async(req,res)=>{
    try {
        //get id 
        const id=req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        //delete the profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
         //unenroll user  form all enrolled courses
        //delete the user 
        await User.findByIdAndDelete({_id:id});
       
        //res return
        return res.status(200).json({
            success:true,
            message:"profile deleted successfully",
          
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Fail to delete the profile ",
            error:error.message,
        })
    }
}

//Get all user details

exports.getAllUersDetails=async(req,res)=>{
    try {
        //get id 
        const id=req.user.id;
        //get user and validation
        const userDetails=await User.find(id).populate("additionalDetails").exec();
        //return res
        return res.status(200).json({
            success:true,
            message:"User Data fetched successfully",
          
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Fail to get all user  the profile ",
            error:error.message,
        })
    }
}
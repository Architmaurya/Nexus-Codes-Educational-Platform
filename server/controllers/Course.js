const Course=require("../models/Course");
const Tag=require("../models/Tags");
const User=require("../models/User");
const{uploadImageToCloudinary}=require("../utils/imageUploader");


//create course 
exports.createCouse=async(req,res)=>{
    try {
        //fetch data 
        const{courseName,courseDescription,whatYoutWillLearn,price,tag}=req.body;

    } catch (error) {
        
    }
}



//get all course 
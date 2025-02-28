// const subsection=require("../models/SubSection");
const Section =require("../models/Section");
const { uploadImageToCloundinary } = require("../utils/imageUploader");
const SubSection = require("../models/SubSection");


//create the Subsectio

exports.createSubsection=async(req,res)=>{
    try {
        //fetch data from Req body
        const {sectionId,title, timeDuration,description}=req.body;
        // extract file/video
        const vedio=req.files.vedioFile;
        //validation
        if(!sectionId||!title||!timeDuration||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //uploadd vedio to cloudinary
        const uploadDetails=await uploadImageToCloundinary(video,process.env.FOLDER_NAME);
        //create the subsection 
        const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update the section with this sub section
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subsection:SubSectionDetails._id,
                }
            },{new:true}
        ).populate("subSection")
        //log update section here after adding populate query
        //return res
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection,
            
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal sever Error",
            error:error.message,
        })
    }
}

//update subsection 


//delete subsection
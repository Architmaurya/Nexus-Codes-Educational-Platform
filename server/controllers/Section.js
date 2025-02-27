const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async(req,res)=>{
    try {
        //data fetch

        const{sectionName,courseId}=req.body;

        //data validatin

        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties ",
            })
        }

        //create section

        const newSection=await Section.create({sectionName})

        //update the course with section object Id

        const updateCourseDetails =await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        );
        //use populate to replace section/sub-section both in the updateCourseDetails
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updateCourseDetails,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to create Section please try again",
            error:error.message

        })
    }
}


//update the section

exports.updateSection=async(req,res)=>{
    try {
        //data input 
        const{sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties ",
            })
        }
        //update the data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section  update  successfully",
            updateCourseDetails,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to update the Section please try again",
            error:error.message

        })
    }
}

//delete Section 

exports.deleteSection=async(req,res)=>{
    try {
        //get Id --assuming that we are sending Id isn params
        const{sectionId}=req.params;
        //use findIdand Delete
        await Section.findByIdAndDelete(sectionId)
        //return response
          return res.status(200).json({
            success:true,
            message:"Section  deleted  successfully",
        
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to delete the Section please try again",
            error:error.message

        })
    }
}
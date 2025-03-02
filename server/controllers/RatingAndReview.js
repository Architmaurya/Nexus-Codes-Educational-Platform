const RatingAndReview=require("../models/RatingAndReview")
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");


//createRating 
exports.createRating=async(req,res)=>{
    try {
        //get user ID 
        const userId =req.userId
        //fetchdata  from the body 
        const {rating,review,courseId}=req.body
        //check if user is enrolled or not 
        const courseDetails=await Course.findOne(
            {_id:courseId,
                studentsEnrolled:{$elemMatch:{$eq:userId}}
            } 
        )
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:'Student is not enrolled in the course'
            })
        }
        //check if user already reviewed the course
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userID,
            course:courseId,
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'Course is already reviewedd by the user',
            })
        }
        //create rating and review
        const ratingReview=await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId
        });
        //update course with this rating review 
       const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},
            {
                $puch:{
                    ratingAndReview:ratingReview._id,
                }
            },
            {new:true}
        )
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created Successfully",
            ratingReview
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
}


//getAveragerating
exports.getAverageRating=async(req,res)=>{
    try {
        //get course id 
        const courseId=req.body.courseId;
        //calculate average rating
        const result =await RatingAndReview.aggregate(
            [
                {$match:{
                    course:new mongoose.Types.ObjectId(courseId),
                        },
                },
                {
                    $group:{
                        _id:null,
                        averageRating:{$avg:"$rating"},
                    }
                }
            ]
        )
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
                
            })
        }
        //id no rating review exist
        return res.status(200).json({
                success:true,
                message:"Average rating is 0 ,no rating given till now ",
                averageRating:0,
           
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
}


//getAllratingandReview
exports.getAllRating=async(req,res)=>{
    try {
        const allReviews=await RatingAndReview.find({})
        .sort({ratind:"desc"})
        .populate({
            path:'user',
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"coreseName"
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
}
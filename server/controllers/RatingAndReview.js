const RatingAndReview=require("../models/RatingAndReview")
const Course=require("../models/Course");


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
            message:"Rating and review not created Successfully",
            
        })
    }
}


//getAveragerating



//getAllrating
const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender")
const{courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");


//capture the payment and initiate the Razorpay order

exports.capturePayment=async(req,res)=>{
    //get course id and user id
    const {course_id}=req.body;
    const userId=req.user.id;
    //validation 
    if(!course_id){
        return res.json({
            success:false,
            message:"Please provide valid course ID",
        })
    };
    //valid courseDetail
    let course;
    try {
        course =await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the course",
            });
        }
         //user already pay for the same course
         const uid=new mongoose.Types.ObjectId(userId);
         if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            })
         }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
   //order create
   const amount=course.price;
   const currency="INR";
   const options={
    amount:amount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
    notes:{
        courseId:course_id,
        userId,
    }
   } 
   try {
    //initiate the payment using razorpay
    const paymentResponse=await instance.orders.create(options);
    console.log(paymentResponse);
    //return response
    return res.status(200).json({
        success:ture,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail:course.thumbnail,
        orderId:paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount,
    })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Could not initiate the payment"
    })
   }
};

//verify Signature of razorpay and Server

exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345678";

    const signature=req.headers["x-razorpay-signature"];

   const shasum= crypto.createHmac("sha256",webhookSecret);
   shasum.update(JSON.stringify(req.body));
   const digest =shasum.digest("hex");
   if(signature===digest){
    console.log("payment is authorised");
    const{courseId,userId}=req.body.payload.payment.entity.notes;
    try {
        //fulfil the action

        //find the course  and enroll the student in it
        const enrolledCourse=await Course.findByIdAndUpdate(
            {_id:courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true},
        );
        if(!enrolledCourse){
            return res.status(500).json({
                success:false,
                message:"Course npot found",
            })
        }
        console.log(enrolledCourse)
        //find the student and add the list enroll the course
        const enrolledStudent =await User.findOne(
            {_id:UserId},
            {$push:{courses:courseId}},
            {new:true},
        );
        console.log(enrolledStudent);
        //mail sender kara do student ko
        const emailResponse=await mailSender(
            enrolledStudent.email,
             "Congratulation ,you are onboarded into new Nexus-Codes ",
            "Congratulation ,you are onboarded into new Nexus-Codes "
        );
        console.log(emailResponse)
        //res return 
        return res.status(200).json({
            success:true,
            message:"Signature verified and Course Added"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

   }
   else{
    return res.status(400).json({
        success:false,
        message:"Invalid Signature "
    })
   }
}
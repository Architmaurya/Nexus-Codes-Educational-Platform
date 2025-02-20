const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");



const otpSchema=new mongoose.Schema({
   email:{
    type:String,
    required:true,
   },
   otp:{
    type:String,
    required:true,
   },
   createAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
   }
})

// a function to send mail

async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse=await mailSender(email,"Verification send by the NEXUS-CODES ",otp);
        console.log("email send successfully",mailResponse);
    } catch (error) {
        console.log("error will run email sending");
        throw error
    }
    
}


otpSchema.pre("save",async function (next) {
    await sendVerificationEmail(this.email,this.otp);
    next();
})




module.exports=mongoose.model("Otp",otpSchema)
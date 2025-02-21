const User =require("../models/User");
const Otp=require("../models/Otp");
const otpGenerator=require("otp-generator")
const bcryt=require("bcrypt");



//send Otp
exports.sendOtp =async (req ,res) => {

  try {
      //fetch email from request ki body
      const {email}=req.body;

      //check if user already exist
      const checkUserPresent=await User.findOne({email});
  
      //if  user is already exist ,then return a response
  
      if(checkUserPresent){
          return res.status(401).json({
              success:false,
              Message:'User already registerd'
          })
      }
        //generate OTP
        var otp =otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("otp Generated",otp);

        //check unique otp or not
        const result =await Otp.findOne({otp:otp});

        while(result){
            otp=otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
         result =await Otp.findOne({otp:otp});
        }
        const otpPayload ={email,otp};
        
        //create an entr for otp
        const otpbody=await Otp.create(otpPayload);
        console.log(otpbody);

        //return response successful
        res.status(200).json({
            success:true,
            Message:'Otp Sent Successfully',
            otp,
        })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        Message:error.Message,
    })
  }

  
}
//signUp

exports.signUp=async(req,res)=>{

  try {
      //data fetch from request ke body

      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    }=req.body;

    //validate krlo

    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
        return res.status(403).json({
            success:false,
            message:"All fields are required"
        })
    }

    //2password match krlo

    if(password !==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirmOassword value does not match with each other",
        })
    }

    //check user already exist or not

    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"user is already registered"
        })
    }

    //find most recent otp stored for the user 

    const recentOtp =await Otp.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    //validate otp
    if(recentOtp.length ==0){
        //Otp not found
        return res.status(400).json({
            success:false,
            message:"Otp not found",
        })
    }
    else if(ptp  !==recentOtp.otp){
        //Invalid OTP
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        });
    }
    //hash password 

    const hashedPassword =await bcryt.hash(password ,10);

    //centry create in DB

    const profileDetails =await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })


    const user =await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastNmae}`,
    })

     //return res
     return res.status(200).json({
        success:true,
        message:"User is registered successfully",
        user
     });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"user connot be gegistrered .Please try again"
    })
  }

   


}

//Login

exports.login=async(req,res)=>{
    try {
        //get data from req body 
        const{email,password}=req.body;
        //validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required , Please try again",
            })
        }
        //user check exist or not

        const user =await User.findOne({email}).populate("additionalDetails");


        //generate token(JWT)after matching the password


        //create cookie and send response
    } catch (error) {
        
    }
};
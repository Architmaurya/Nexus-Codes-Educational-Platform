const User=require("../models/User");
const bcrypt=require("bcrypt")
const mailSender =require("../utils/mailSender");


//resetPasswordToken

exports.resetPasswordToken =async(req,res)=>{
try {
        //get email fron the req body 

        const email=req.body.email;
        //check user for this email ,email validation 
        const user =await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:"Your email is not registered with us ",
            })
        }
        //generate token 
    
        const token =crypto.randomUUID();
    
        //update user by adding token and expiration time
    
        const updateDetails=await User.findOneAndUpdate(
                                                      {email:email},
                                                    {
                                                        token:token,
                                                        resetPasswordExpires:Date.now()+ 5*60*1000,
                                                    },{new:true})
    
        //create url 
        const url =`http://localhost:3000.update-password/${token}`
        //send mail containing theurl
    
        await mailSender(email,"Password Reset Link",`Password Reset Link ${url}`);
    
        //return res
    
        return res.json({
            success:true,
            message:"Email sent successfully ,Please check the email and change password"
        });
} catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Something went wrong while reset the password mail",
    })
}

}

//resetpasswordDatabaseupdate

exports.resetPassword=async(req,res)=>{
    try {
        //data fetch 
        const{password, consfirmPassword ,token}=req.body;
        //validatin 
        if (password!==consfirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }
        //get userDetails from the DB using the token 

        const userDetails=await User.findOne({token:token});

        //if no entry  - invalid token 

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            })
        }

        //token time check 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token is expired ,Please regenrate your token",
            })
        }

        //hash the password 

        const hashedPassword=await bcrypt.hash(password,10);

        //update the password 
        
        await User.findByIdAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},

        )

        //return the res
        return res.status(200).json({
            success:true,
            message:"Password reset successful",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset the password mail",
        })
    }
}
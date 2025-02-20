const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
    },
    dateofBirth:{
        type:String,
    },
    about:{
        tupe:String,
        trim:true,
    },
    contactNumber:{
        type:String,
        trim:ture,
    }
 
})

module.exports=mongoose.model("Profile",profileSchema)
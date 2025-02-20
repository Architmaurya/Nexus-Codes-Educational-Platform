const mongoose=require("mongoose");

const SubSection=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    vedioUrl:{
        type:String,
    },
})

module.exports=mongoose.model("SubSection",SubSection)
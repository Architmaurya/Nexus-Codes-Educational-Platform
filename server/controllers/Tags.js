const Tag=require("../models/Tags");


//create tag ka handler function 

exports.createTag=async(req,res)=>{
    try {
        //fetch data
        const{name,description}=req.body;
        //validation 
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create entry in DB
        const tagDatails=await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDatails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        });
    } catch (error) {
        return res.status(500),json({
            success:false,
            message:error.message
        })
    }
}


//getAll tags handler function 

exports.showAlltags=async(req,res)=>{
    try {
        const alltags=await Tag.find({},{name:true,description:true})  
        return res.status(200),json({
            success:true,
            message:"All tags return successfully",
            alltags,
    })
      } catch (error) {
          return res.status(500),json({
              success:false,
              message:error.message
      })
  }
}

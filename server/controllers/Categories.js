const Category = require("../models/Category");
const Course = require("../models/Course");

// createTag 
exports.createCategory = async(req , res) => {
    try{
                // fetch data 
              const {name , description} = req.body;
                 //validation
              if(!name || !description){
                return res.status(400).json({
                    success:false,
                    message:"All fields are Required"
                });
              }
                 //create entry in DB
              const categoryDetails = await Category.create({
                name:name,
                description:description
              });
              console.log("Category details are : " , categoryDetails);
                //return res
              return res.status(200).json({
                success:true,
                message:"Category Created Successfully"
              });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


// getAllTags 
exports.getAllCategories =  async(req, res) => {
    try{
        const allCategories = await Category.find({} , {name:true , description:true});

           //return res
           return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
            allCategories,
          });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//category Page details
exports.categoryPageDetails = async (req ,res) => {
  try{
         //get categ 
         const {categoryId} =req.body;
         const selectedCatgoryCourses = await Category.findById(categoryId)
                                                              .populate("courses")
                                                              .exec();
         if(!selectedCatgoryCourses) {
                 return res.status(404).json({
                  success:false,
                  message:"Data not found"
                 })
                  }    
                  
        const differentCetgories = await Category.find({
          _id: {$ne :categoryId},
        }).populate("courses")
        .exec();

        // HW: how to get top selling courses 
        



        return res.status(200).json({
          success:true,
          data:{ selectedCatgoryCourses,
          differentCetgories,}

        })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message,
  });
  }
}
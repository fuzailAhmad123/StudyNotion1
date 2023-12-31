const Section = require("../models/Section");
const Course  = require("../models/Course");

// create Section  
exports.createSection = async (req , res) => {
    try{
        //  data fetch 
        const {sectionName , courseId} = req.body;
        //data validate 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All Properties are Required"
            });
        }
        //create Sectionn
        const newSection = await Section.create({sectionName});
        //update course with section ObjectID
        const updatedCourse = await Course.findOneAndUpdate( 
                                                             { _id: { $eq: courseId } } ,
                                                             {
                                                                $push:{
                                                                    courseContent:newSection._id,
                                                                }
                                                             },
                                                             {new:true}
                                                             ).populate({
                                                                path: "courseContent",
                                                                populate: {
                                                                    path: "subSections",
                                                                },
                                                            })
                                                            .exec();
                //  hw: use populate to replace ID with scetion and subsection details 
                      
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourse,
        })
    }catch(error){

        console.log("Unable to create Section : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to create Section , Please Try again",
             error:error.message
        });
    }
};


// update Sections 
exports.updateSection = async(req ,res) => {
    try{
        // datea fetch 
        const  {sectionName , sectionId}  = req.body;
        //validate 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All Properties are Required"
            });
        }
        //update data
        const section = await Section.findOneAndUpdate( 
                                                       sectionId,
                                                       {sectionName},
                                                       {new:true}) ;

         //return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            
        })                                              
    }catch(error){

        console.log("Unable to update Section : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to update Section , Please Try again",
             error:error.message
        });
    }
};

// delete Section 
exports.deleteSection = async (req ,res) => {
    try{
            const {sectionId , courseId} = req.body;

           
            // HW:HOw to delete from course 
               
            await Section.findByIdAndDelete(sectionId);
            console.log( "Sections :", await Section.find());

            // HW: Do we have to delete from course schema also 
             //return res
            return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
           
        }) 
    }
    catch(error){

        console.log("Unable to delete Section : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section , Please Try again",
             error:error.message
        });
    }
}
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

require("dotenv").config();




// create sub Section 
exports.createSubSection = async (req , res) => {
    try{
            // fetch data from req body 
            const {sectionId , title , timeDuration , description} = req.body;
            //extraxt file / video
            const video = req.files.videoFile;
            //validation 
            if(!sectionId || !title || !timeDuration || !description || !video){
                return res.status(400).json({
                    success:false,
                    message:"All Properties are Required"
                });
            }
            //upload video to clouidnary 
            const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME)
            //create subsection
            const subSectionDetails  = await SubSection.create({
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url,
            })
            //create its entry in SECtion //
            const updatedSection = await Section.findOneAndUpdate({_id:sectionId},
                                                                     {$push:{
                                                                        subSections:subSectionDetails._id,
                                                                     }},
                                                                     {new:true})
                                                                     .populate("subSections")
                                                                     .exec();
            return res.status(200).json({
                success:true,
                message:"SubSection Created Successfully",
                updatedSection,
            })
    }catch(error){

        console.log("Unable to create SubSection : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to create SubSection , Please Try again",
             error:error.message
        });
    }
};

// update subSection
exports.updateSubSection = async(req ,res) => {
    try{
        // datea fetch 
        const  {title , description , timeDuration, video , SubSectionId}  = req.body;
        //validate 
        if(!title || !timeDuration || !description || !video || !SubSectionId){
            return res.status(400).json({
                success:false,
                message:"All Properties are Required"
            });
        }
        //update data
        const SubSection = await SubSection.findOneAndUpdate( 
                                                       SubSectionId,
                                                       {title:title,
                                                        timeDuration:timeDuration,
                                                        description:description,
                                                        videoUrl:video,},
                                                       {new:true}) ;

         //return res
        return res.status(200).json({
            success:true,
            message:"SubSection Updated Successfully",
            
        })                                              
    }catch(error){

        console.log("Unable to update SubSection : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to update SubSection , Please Try again",
             error:error.message
        });
    }
};


// delete SubSection 
exports.deleteSubSection = async (req ,res) => {
    try{
            const {SubSectionId} = req.body;
            await Section.findOneAndDelete(SubSectionId);

            // HW: Do we have to delete from course schema also 
             //return res
            return res.status(200).json({
            success:true,
            message:"SubSection Deleted Successfully",
            updatedCourse,
        }) 
    }
    catch(error){

        console.log("Unable to delete SubSection : " , error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete SubSection , Please Try again",
             error:error.message
        });
    }
}
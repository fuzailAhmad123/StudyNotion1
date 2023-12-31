
const Profile = require("../models/Profile");
const User  = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber , gender } = req.body;
		const id = req.user.id;

    if( !contactNumber || !gender ){
      return res.json({
        success:false,
        message:"All fields are required"
      });
    }

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);
    // console.log("profile : " , profile);
   
		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
    profile.gender = gender;

		// Save the updated profile
		await profile.save();
    const updatedUserDetails = await User.findById(id).populate("additionalDetails")

		return res.json({
			success: true,
			message: "Profile updated successfully",
      updatedUserDetails,
      
      
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};


// delete Account 
exports.deleteAccount  = async (req ,res) => {
    try{
        //get ID
        const id = req.user.id;
        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not Found"
            });
        }
        //deleted profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // HW:un Enroll user from all courses
        // HW:How can we schedule a request 
        // HW: Esplore crone job 
        //delete USer
        await User.findByIdAndDelete({_id:id});
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile Deleted Successfully",
            userDetails,
        });
           

    }catch(error){
        console.log("Error while Deleting Profile : " , error);
        return res.status(500).json({
            success:false,
            message:"Error while Deleting Profile ",
            error:error.message,
        })
    }
}


exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id).populate("additionalDetails").exec();
			
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

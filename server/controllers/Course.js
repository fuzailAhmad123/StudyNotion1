const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// createCourse handler func
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    let { courseName, courseDescription, whatYouWillLearn, price, category , status } =
      req.body;

    // fetch file
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    if (!status || status === undefined) {
			status = "Draft";
		}
    // get instructor from db (yha ek baar check krna hai baad mein !!!!)
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details : ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Not Found",
      });
    }

    // Tag validation -> tag is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Pleaase Enter a Valid Category",
      });
    }

    // Upload image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create course in DB
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      status: status,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add new course to User Schema
    await User.findOneAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // add new course to Tag Schema
    await Category.findOneAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "New Course Created Successfully",
      data:{newCourse}
    });
  } catch (error) {
    console.log("Error occured while Creatinng New Course : ", error);
    return res.status(500).json({
      success: false,
      message: "Error occured while Creatinng New Course",
    });
  }
};

// getAllCourses handler func
exports.getAllCourses = async (rqe, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: " All Courses Fetched Successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log("Error occured while Fetching all Courses : ", error);
    return res.status(500).json({
      success: false,
      message: "Error occured while Fetching all Courses",
    });
  }
};

// getCourse Details
exports.getCourseDetails = async (req, res) => {
  try {
    // getID
    const { courseId } = req.body;
    // find course details
    const courseDetails = await Course.findById( courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    //  validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Coudn't find any course with this courseId :  ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      courseDetails,
    });
  } catch (error) {
    console.log("Error occured while fetching  Course Details : ", error);
    return res.status(500).json({
      success: false,
      message: "Error occured while Fetching Course Details",
    });
  }
};

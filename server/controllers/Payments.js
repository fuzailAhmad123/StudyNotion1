const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");


//capture payment and initiate razorpay order
exports.capturePayment = async (req, res) => {
  try {
    //   get courseId and userId
    const { course_id } = req.body;
    const { user_id } = req.user.id;
    //validation
    // valid courseId
    if (!course_id) {
      return res.json({
        success: false,
        message: "Please enter a valid CourseId",
      });
    }

    // valid userId
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Cannot find the Course",
        });
      }
      // user if user already paid for course already
      const uid = new mongoose.Types.ObjectId(user_id);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "USer Already bought the Course",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    //create order
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course_id,
        user_id,
      },
    };

    try {
      //    initiate payment usinng Razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("Payment Response is : ", paymentResponse);

      // return res
      return res.status(200).json({
        success: true,
        message: "Order created successfully",
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderID: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Coudn't Initiate Order",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Coudn't Initiate Order",
    });
  }
};

// Verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "123456";

  const signature = req.headers["x-razorpay-signature"];

  // HW: What is checkSum ?
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorized");
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // find course and enroll student
      const enrolledCourses = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );

      if (!enrolledCourses) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      console.log(enrolledCourses);

      //   find student and add courseId in Enrolled courses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            courses:courseId,
          },
        },
        { new: true }
      );

      if (!enrolledStudent) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

    //   mail send of course purchase successfull 
    const emailResponse = await mailSender(
                                              enrolledStudent.email,
                                              "Congratulation !!! You are onboarded in New StudyNotion Course",
                                              "Congratulation !!! You are onboarded in New StudyNotion Course",
    );

    console.log(emailResponse);
    return res.status(200).json({
        success:true,
        message:"Signature Verified successfully and Course Added"
    });


    } catch (error) {
        console.log(error);
               return res.status(500).json({
                        success: false,
                       message: "Coudn't Verify Signature",
                });
    }
  }

  else{
    return res.status(400).json({
        success: false,
       message: "Invalid request",
});
  }
};

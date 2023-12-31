const express = require("express");
const { createCategory, getAllCategories, categoryPageDetails } = require("../controllers/Categories");
const { createRating, getAvgRating, getAllRating } = require("../controllers/RatingAndReview");
const {auth , isAdmin , isStudent , isInstructor} = require("../middlewares/auth");
const { createCourse, getAllCourses, getCourseDetails } = require("../controllers/Course");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/SubSection")
const router  = express.Router();

//********************************************************************** */
//                                Course Routes
//********************************************************************** */
router.post("/createCourse" , auth ,isInstructor , createCourse);
//Add Section
router.post("/addSection" , auth , isInstructor , createSection);
//update Section
router.post("/updateSection" , auth ,isInstructor , updateSection);
//delete section from  course 
router.post("/deleteSection" , auth , isInstructor  , deleteSection);
//add subsection 
router.post("/addSubSection" , auth , isInstructor , createSubSection );
//update subsection 
router.post("/updateSubSection" , auth , isInstructor , updateSubSection );
//delete subsection 
router.post("/deleteSubSection" , auth , isInstructor , deleteSubSection );
// get details for all courses 
router.get("/getAllCourses", getAllCourses);
// get Details for Specific Course 
router.post("/getCourseDetails" , getCourseDetails);




//********************************************************************** */
//                                Category Routes
//********************************************************************** */

router.post("/createCategory" , auth ,isAdmin , createCategory);
router.get("/getAllCategories" , getAllCategories);
router.post("/getCategoryPageDetails" , categoryPageDetails);


//**************************************************************************************************************** */
                                              //Rating And Reviews

//**************************************************************************************************************** */
router.post("/createRating" , auth , isStudent , createRating);
router.get("/getAvgRating" , getAvgRating);
router.get("/getReviews" , getAllRating);


module.exports = router;
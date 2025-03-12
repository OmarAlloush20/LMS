import Course from "../Models/Course.js";

const addNewCourse = async (req, res) => {
  try {
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with adding new course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with get courses",
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with get course details",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with update  course",
    });
  }
};

export { addNewCourse, getAllCourses, getCourseDetails, updateCourseByID };

import Course from "../Models/Course.js";

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(200).json({
        success: true,
        message: "Course is Created",
        data: saveCourse,
      });
    }
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
    const courseList = await Course.find({});

    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with get courses",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    res.status(200).json({
      success: true,
      data: courseDetails,
    });
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
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error with update  course",
    });
  }
};

export { addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID };

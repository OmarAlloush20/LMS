import Course from "../Models/Course.js";

// course view

const getAllStudentViewCourses = async (req, res) => {
  try {
    const courseList = await Course.find({});

    if (courseList.length === 0) {
      res.status(404).json({
        success: false,
        msg: "No Course Found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occured",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      res.status(404).json({
        success: false,
        msg: "No Course Details Found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occured",
    });
  }
};

export { getAllStudentViewCourses, getStudentViewCourseDetails };

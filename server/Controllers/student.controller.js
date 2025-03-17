import Course from "../Models/Course.js";
import StudentCourses from "../Models/StudentCourses.js";

// course view

const getAllStudentViewCourses = async (req, res) => {
  try {
    //adding filter
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }
    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;

        break;
      case "price-hightolow":
        sortParam.pricing = -1;

        break;
      case "title-atoz":
        sortParam.title = 1;

        break;
      case "title-ztoa":
        sortParam.title = -1;

        break;

      default:
        sortParam.pricing = 1;
        break;
    }
    const courseList = await Course.find(filters).sort(sortParam);

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
    const { id, studentId } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      res.status(404).json({
        success: false,
        msg: "No Course Details Found",
        data: null,
      });
    }

    // check if the current student parchased this course
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    const ifStudenetAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1;

    console.log(ifStudenetAlreadyBoughtCurrentCourse);

    res.status(200).json({
      success: true,
      data: courseDetails,
      coursePurchaseId: ifStudenetAlreadyBoughtCurrentCourse ? id : null,
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

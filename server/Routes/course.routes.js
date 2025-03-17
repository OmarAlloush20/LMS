import express from "express";
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  deleteCourseByID,
} from "../Controllers/course.controller.js";


const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id/:studentId", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);
router.delete("/delete/:id", deleteCourseByID);

export default router;

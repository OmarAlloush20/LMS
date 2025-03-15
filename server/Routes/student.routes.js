import express from "express";
import {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
} from "../Controllers/student.controller.js";

const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);

export default router;

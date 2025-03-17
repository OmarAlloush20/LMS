import express from "express";
import { getCourseByStudentId } from "../Controllers/studentCourse.controller.js";

const router = express.Router();

router.get("/get/:studentId", getCourseByStudentId);

export default router;

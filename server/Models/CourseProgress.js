import mongoose from "mongoose";

const LecturesProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LecturesProgressSchema],
});

export default mongoose.model("Progress", CourseProgressSchema);

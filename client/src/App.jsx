import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/protected-route";
import { AuthContext } from "./context/auth-context";
import { useContext } from "react";
import InstructorDashboardPage from "./pages/instructor/mainPage";
import StudentViewCommonLayout from "./components/student-view/commonLayout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/addNewCourse";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/courseDetails";
import PaymentSuccessPage from "./pages/payment-return";
import StudentCoursesPage from "./pages/student/studentCoursesPage";
import StudentViewCourseProgressPage from "./pages/course-progress/progress";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="payment-return" element={<PaymentSuccessPage />} />
          <Route path="/student-courses" element={<StudentCoursesPage />} />
          <Route
            path="/course-progress/:id"
            element={<StudentViewCourseProgressPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

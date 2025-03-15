import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCourses, setStudentViewCoursesList] = useState([]);

  return (
    <StudentContext.Provider
      value={(studentViewCourses, setStudentViewCoursesList)}
    >
      {children}
    </StudentContext.Provider>
  );
}

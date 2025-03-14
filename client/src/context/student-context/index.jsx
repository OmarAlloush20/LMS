import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCourses, setStudentCoursesList] = useState([]);

  return (
    <StudentContext.Provider value={(studentCourses, setStudentCoursesList)}>
      {children}
    </StudentContext.Provider>
  );
}

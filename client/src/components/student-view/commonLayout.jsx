import { Outlet } from "react-router-dom";
import StudentViewCommonHeader from "./header";

function StudentViewCommonLayout() {
  return (
    <div className="common-layout">
      <StudentViewCommonHeader />
      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;

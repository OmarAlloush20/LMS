import { Outlet } from "react-router-dom";

function StudentViewCommonLayout() {
  return (
    <div className="common-layout">
      Common Content
      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;

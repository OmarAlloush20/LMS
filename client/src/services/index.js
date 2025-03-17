import axiosInstance from "@/api/axiosInstance";

async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const precentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(precentCompleted);
    },
  });

  return data;
}

async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const precentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(precentCompleted);
    },
  });

  return data;
}

async function fetchStudentCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

async function fetchStudentCourseDetailsService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}/${studentId}`
  );

  return data;
}

async function createPaymentService(formData) {
  const { data } = await axiosInstance.post("/student/order/create", formData);
  return data;
}

async function captureAndFinalizePaymentService(sessionId, orderId) {
  const { data } = await axiosInstance.post("/student/order/capture", {
    sessionId,
    orderId,
  });
  return data;
}

async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export {
  registerService,
  loginService,
  checkAuthService,
  mediaUploadService,
  mediaDeleteService,
  fetchInstructorCourseListService,
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
  mediaBulkUploadService,
  fetchStudentCourseListService,
  fetchStudentCourseDetailsService,
  createPaymentService,
  captureAndFinalizePaymentService,
  fetchStudentBoughtCoursesService,
};

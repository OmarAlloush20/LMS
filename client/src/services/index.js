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

export {
  registerService,
  loginService,
  checkAuthService,
  mediaUploadService,
  mediaDeleteService,
};

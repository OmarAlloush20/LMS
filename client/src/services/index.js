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

async function mediaUploadService(formData) {
  const { data } = await axiosInstance.post("/media/upload", formData);

  return data;
}

export { registerService, loginService, checkAuthService, mediaUploadService };

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const generateInterviewReport = async({
  resume,
  jobDescription,
  selfDescription,
}) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  const response =await api.post("/api/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getInterviewReport = async(id) => {
  const response =await api.get(`/api/interview/${id}`);
  return response.data;
};
export const getInterviewReports = async() => {
  const response =await api.get("/api/interview");
  return response.data;
};


export const generateInterviewReportPdf = async({id}) => {
  const response =await api.post(`/api/interview/pdf/${id}`,null,{
    responseType:"blob",
  });
  return response.data;
}
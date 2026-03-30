import { useContext } from "react";
import { InterviewContext } from "../InterviewContext";
import {
  generateInterviewReport,
  generateInterviewReportPdf,
  getInterviewReport,
  getInterviewReports,
} from "../services/InterviewApi";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within a InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resume,
  }) => {
    setLoading(true);
      let response;
    try {
       response = await generateInterviewReport({
        resume,
        jobDescription,
        selfDescription,
        
      });
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    
    return response.interviewReport;
  };

  const getAllReports = async () => {
    setLoading(true);
      let response;
    try {
       response = await getInterviewReports();
      setReports(response?.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response;
  };

  const getReportById = async (id) => {
    setLoading(true);
      let response;
    try {
       response = await getInterviewReport(id);
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    
    return response;
  };

  const generateResumePdf = async(interviewId) => {
    setLoading(true);
      let response;
    try {
       response = await generateInterviewReportPdf(interviewId);
       const url = window.URL.createObjectURL(new Blob([response],{ type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `resume_${interviewId}.pdf`);
        document.body.appendChild(link);
        link.click();
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
   
    return response;
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    generateResumePdf,
    getAllReports,
    getReportById,
  };
};

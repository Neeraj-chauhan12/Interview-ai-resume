const pdfParse = require("pdf-parse");
const {generateInterviewReport} = require("../services/aiService");
const InterviewModel = require("../models/InterviewReportModel");


// Generate interview report based on resume, job description and self description
exports.InterviewGenerateReportController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume is required" });
  }

  const resumeContent = await (new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer))).getText();
    console.log("resumeContent", resumeContent.text);

  if (!resumeContent.text) {
    return res.status(400).json({ message: "PDF text extraction failed" });
  }

 
  const { jobDescription, selfDescription } = req.body;

  const interviewReportAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription: selfDescription,
    jobDescription: jobDescription,
  });

  const interviewReport = await InterviewModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportAi,
  });

  res.status(200).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
};

// Get a single interview report by ID
exports.getInterviewReport = async (req, res) => {
  const { InterviewId } = req.params;
 
  try {
    const interviewReport = await InterviewModel.findById({_id:InterviewId,user:req.user.id});
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    return res
      .status(200)
      .json({ message: "Interview report found", interviewReport });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all interview reports for a user, sorted by creation date in descending order
exports.getInterviewReportAll = async (req, res) => {
  const userId=req.user.id;
  try {
    const interviewReport = await InterviewModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    return res
      .status(200)
      .json({ message: "Interview report found", interviewReport });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// generate the interview report in pdf format and send it as response
exports.generateInterviewReportPdfController = async (req, res) => {
  const { InterviewId } = req.params;
  try {
    const interviewReport = await InterviewModel.findById(InterviewId);
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
  
    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer=await generateInterviewReport.generateResumePdf({resume,jobDescription,selfDescription});

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=interview_report_${InterviewId}.pdf`,
    });
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("Error generating interview report PDF:", error);
    return res.status(500).json({ message: "Server error" });
  }
};  
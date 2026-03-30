const express = require('express');
const { AuthMiddleware } = require('../middlewares/AuthMiddleware');
const { getInterviewReport, getInterviewReportAll, InterviewGenerateReportController, generateInterviewReportPdfController } = require('../controllers/InterviewControllers');
const upload = require('../middlewares/fileMiddleware');
const interviewRouter=express.Router();

interviewRouter.post("/",AuthMiddleware,upload.single("resume"),InterviewGenerateReportController)
interviewRouter.get("/:InterviewId",AuthMiddleware,getInterviewReport)
interviewRouter.get("/",AuthMiddleware,getInterviewReportAll);

interviewRouter.post("/pdf/:InterviewId",AuthMiddleware,generateInterviewReportPdfController)

module.exports=interviewRouter;
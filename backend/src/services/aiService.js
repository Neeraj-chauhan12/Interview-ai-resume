const { GoogleGenAI } = require("@google/genai");
const {z}=require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description, with higher scores indicating a better match.",),

  technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question asked during the interview."),
        intention: z.string().describe("The intention behind asking the technical question."),
        answer: z.string().describe( "How to answer this questionn, what points to cover , what approach to take etc.", ),
      }),
    ).describe( "A list of technical questions asked during the interview, along with their intentions and suggested answers.", ),

  behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question asked during the interview."),
        intention: z.string().describe("The intention behind asking the behavioral question."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.", ),
      }),
    ).describe("A list of behavioral questions asked during the interview, along with their intentions and suggested answers."),

  skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking based on the interview performance.", ),
        severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap, indicating how critical it is for the candidate to improve this skill.",),
      }),
    ).describe("A list of identified skill gaps based on the interview performance, along with their severity levels.",),

  preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, indicating the sequence of the preparation steps.",),
        focus: z.string().describe("The main focus or topic for the preparation on that particular day.",),
        tasks: z.array(z.string()).describe( "A list of specific tasks or activities that the candidate should undertake on that day to prepare effectively.",),
      }),
    ).describe("A structured preparation plan for the candidate, outlining daily focus areas and specific tasks to improve their interview performance.",),

  title: z.string().describe("The title of the interview report."),
});



async function generateInterviewReport({resume,jobDescription, selfDescription,}) {
  const prompt = `Based on the following job description, candidate's resume and self description, generate a detailed interview report that includes a match score, technical questions with intentions and answers, behavioral questions with intentions and answers, identified skill gaps with severity levels, and a structured preparation plan for the candidate.   
  IMPORTANT:
- Do NOT return empty arrays
- Generate at least:
  - 5 technical questions
  - 5 behavioral questions
  - 3 skill gaps
  - 5 day preparation plan
  Job Description: ${jobDescription}
         Resume: ${resume}
         Self Description: ${selfDescription}
         `;

  const response = await ai.models.generateContent({
     model: "gemini-3-flash-preview",
    //model: "gemini-2.5-flash",

    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });
  //console.log(JSON.parse(response.text));
  const responseJson = JSON.parse(response.text);
  console.log("ai response", responseJson);
  return responseJson;
}




async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" ,marjin:{top:"15mm",bottom:"10mm",left:"10mm",right:"10mm"}});
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({resume,jobDescription,selfDescription}) {
  const resumePdfSchema=z.object({
  html:z.string().describe("The HTML content extracted from the candidate's resume PDF, which should be analyzed to extract relevant information for generating the interview report."),
});

 const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

                    const response = await ai.models.generateContent({
                      model: "gemini-3-flash-preview",
                      //model: "gemini-2.5-flash",
                      contents: prompt,
                      config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(resumePdfSchema),
                      },
                    });
                   
                    
                      const jsonContent = JSON.parse(response.text)
                      const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
                      return pdfBuffer
  
}

module.exports = {generateInterviewReport,generateResumePdf};

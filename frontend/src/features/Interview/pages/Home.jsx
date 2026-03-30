import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [showReportsMobile, setShowReportsMobile] = useState(false);
  const resumeInputRef = useRef();
  const { generateReport, reports, loading, getAllReports } = useInterview();
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumefile = resumeInputRef.current.files[0];
    if (!resumefile) {
      toast.error("Please upload a PDF resume.");
      return;
    }
    const response = await generateReport({
      jobDescription,
      selfDescription,
      resume: resumefile,
    });
    toast.success("Interview report generated successfully!");
    setJobDescription("");
    setSelfDescription("");
    navigate(`/interview/${response._id}`);
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Mobile Recent Reports floating button */}
      <button
        onClick={() => setShowReportsMobile(true)}
        className="md:hidden fixed top-2 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Recent Reports
      </button>

      {showReportsMobile && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 flex items-start justify-end">
          <div className="w-80 max-w-[90vw] h-full bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Interview Reports
              </h2>
              <button
                onClick={() => setShowReportsMobile(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            {reports.length === 0 ? (
              <p className="text-gray-600">No reports found.</p>
            ) : (
              <div className="space-y-3">
                {reports?.map((report) => (
                  <div
                    onClick={() => {
                      navigate(`/interview/${report._id}`);
                    }}
                    key={report._id}
                    className="bg-gray-100 rounded-lg p-3"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {report?.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {report?.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto grid gap-8 md:grid-cols-[1fr_340px] items-start">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Interview Preparation
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your resume and provide details to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PDF Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Resume Upload
                </h2>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  ref={resumeInputRef}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-gray-600">
                      Click to upload your PDF resume
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Job Description
                </h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                rows={6}
              />
              <p className="text-sm text-gray-500">
                Characters: {jobDescription.length}
              </p>
            </div>
          </div>

          {/* Self Description Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Self Description
              </h2>
            </div>
            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Characters: {selfDescription.length}
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateReport}
              className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {loading ? "Generating Report..." : "Generate Report"}
            </button>
          </div>
        </div>

        <aside className="hidden md:block sticky top-4 h-fit rounded-2xl bg-white shadow-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Interview Reports
          </h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports found.</p>
          ) : (
            <div className="space-y-3">
              {reports?.map((report) => (
                <div
                  onClick={() => {
                    navigate(`/interview/${report._id}`);
                  }}
                  key={report._id}
                  className="bg-gray-100 rounded-lg p-3"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {report?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{report?.description}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Home;

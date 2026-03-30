import React, { useEffect, useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";


const sections = [
  { key: "technical", label: "Technical Questions" },
  { key: "behavioral", label: "Behavioral Questions" },
  { key: "roadmap", label: "Road Map" },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileMenuRef = useRef(null);
  const { report, getReportById,generateResumePdf,loading } = useInterview();
  const navigate=useNavigate();
  const interviewId = useParams();
  const { user,handleLogout } = useAuth();


  const handleGeneratePDF=async()=>{
    await generateResumePdf(interviewId);
    toast.success("Resume generated successfully");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId.id);
    }
  }, [interviewId]);

  const handleLogoutClick=async()=>{
     await handleLogout();
     
  }

  const toggleQuestion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[250px_1fr_300px] gap-4">
        {/* {profile} */}

        <div className="fixed top-1 right-1 z-50" ref={profileMenuRef}>
          <div className="relative">
            <button
              onClick={() => setShowProfilePopup((prev) => !prev)}
              className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 rounded-full p-1"
              aria-label="Toggle profile popup"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {showProfilePopup && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 border border-slate-800 shadow-xl p-3 text-sm text-slate-100">
                <div className="mb-2">
                  <p className="font-semibold">{user?.username || "Guest User"}</p>
                  <p className="text-xs text-slate-400">{user?.email || "No email"}</p>
                </div>
                <hr className="my-2 border-slate-700" />
                <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800">Profile</button>
                <button onClick={()=>{navigate("/")}} className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800">Home</button>
                <button onClick={handleLogoutClick} className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800">Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Left sidebar */}
        <aside className="bg-slate-900/80  border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400">
            Sections
          </h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(section.key);
                  setExpandedIndex(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  activeSection === section.key
                    ? "bg-slate-700 text-cyan-300 border border-cyan-400"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <button onClick={handleGeneratePDF} className="px-10 py-2 bg-gray-600/45 w-full border border-slate-800 text-left rounded-lg hover:bg-slate-800">
           
           {loading ? "Downloading..." : "Download resume"} 
           
          </button>
        </aside>

        {/* Main content */}
        <main className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          {/* this is the technical questions */}

          {activeSection === "technical" && (
            <div className="space-y-3">
              {report?.technicalQuestions.map((item, idx) => (
                <div
                  key={`technical-${idx}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 shadow-inner"
                >
                  <button
                    onClick={() => toggleQuestion(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800 transition"
                  >
                    <span className="text-base md:text-lg font-medium text-slate-100">
                      Q0{idx + 1} {item?.question}
                    </span>
                    <span className="text-lg text-cyan-300">
                      {expandedIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {expandedIndex === idx && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* this is the behavioral questions */}
          {activeSection === "behavioral" && (
            <div className="space-y-3">
              {report?.behavioralQuestions.map((item, idx) => (
                <div
                  key={`behavioral-${idx}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 shadow-inner"
                >
                  <button
                    onClick={() => toggleQuestion(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800 transition"
                  >
                    <span className="text-base md:text-lg font-medium text-slate-100">
                      Q0{idx + 1} {item?.question}
                    </span>
                    <span className="text-lg text-cyan-300">
                      {expandedIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {expandedIndex === idx && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* this is the roadmap */}
          {activeSection === "roadmap" && (
            <div className="space-y-3">
              {report?.preparationPlan.map((item, idx) => (
                <div
                  key={`roadmap-${idx}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 shadow-inner"
                >
                  <button
                    onClick={() => toggleQuestion(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800 transition"
                  >
                    <span className="text-base md:text-lg font-medium text-slate-100">
                      Day {item?.day}: {item?.focus}
                    </span>
                    <span className="text-lg text-cyan-300">
                      {expandedIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {expandedIndex === idx && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item?.tasks.map((task, taskIdx) => (
                          <li key={`task-${taskIdx}`}>{task}</li>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right panel */}
        <aside className="space-y-4">
          <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <h3 className="text-sm uppercase tracking-widest mb-3 text-sky-400">
              Match Score
            </h3>
            <div className="w-full h-24 rounded-xl bg-slate-800 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-emerald-400"
                style={{ width: `${report?.matchScore}%` }}
              />
              <div className="relative h-full flex items-center justify-center text-4xl font-bold text-white">
                {report?.matchScore}%
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Strong match for this role
            </p>
          </section>

          <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <h3 className="text-sm uppercase tracking-widest mb-3 text-slate-200">
              Skill Gaps
            </h3>
            <ul className="space-y-2 text-sm">
              {report?.skillGaps.map((gap, idx) => (
                <li
                  key={`gap-${idx}`}
                  className="px-3 py-2 rounded-lg bg-rose-800/60 text-rose-200"
                >
                  {gap?.skill || "Skill gap not specified"}
                  <span className="ml-2 text-xs bg-rose-600 text-rose-200 px-2 py-1 rounded">
                    {gap?.severity || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Interview;

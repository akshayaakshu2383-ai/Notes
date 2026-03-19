"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, GraduationCap, Code2, Sparkles, Download, ArrowRight, ArrowLeft } from "lucide-react";
import ResumePreview from "./ResumePreview";

const steps = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "skills", title: "Skills", icon: Code2 },
];

export default function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: { name: "", email: "", phone: "", location: "", linkedin: "" },
    experience: [{ role: "", company: "", duration: "", desc: "" }],
    education: [{ degree: "", school: "", year: "" }],
    skills: "",
  });
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (section: string, field: string, value: string, index?: number) => {
    if (index !== undefined) {
      const newList = [...(formData as any)[section]];
      newList[index][field] = value;
      setFormData({ ...formData, [section]: newList });
    } else {
      setFormData({ ...formData, [section]: { ...(formData as any)[section], [field]: value } });
    }
  };

  const addExperience = () => {
    setFormData({ ...formData, experience: [...formData.experience, { role: "", company: "", duration: "", desc: "" }] });
  };

  const addEducation = () => {
    setFormData({ ...formData, education: [...formData.education, { degree: "", school: "", year: "" }] });
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        body: JSON.stringify({ type: "resume", data: formData }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedResume(data.content);
        setCurrentStep(steps.length); // Move to final preview
      }
    } catch (err) {
      alert("Failed to generate resume. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${idx <= currentStep ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-800 text-slate-500"}`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs mt-2 ${idx <= currentStep ? "text-indigo-400 font-bold" : "text-slate-500"}`}>{step.title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Container */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
              <input type="text" placeholder="Full Name" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={formData.personal.name} onChange={(e) => handleInputChange("personal", "name", e.target.value)} />
              <input type="email" placeholder="Email" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={formData.personal.email} onChange={(e) => handleInputChange("personal", "email", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Phone" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={formData.personal.phone} onChange={(e) => handleInputChange("personal", "phone", e.target.value)} />
                <input type="text" placeholder="Location (e.g. New York)" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={formData.personal.location} onChange={(e) => handleInputChange("personal", "location", e.target.value)} />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Experience</h2>
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-4">
                  <input type="text" placeholder="Role" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={exp.role} onChange={(e) => handleInputChange("experience", "role", e.target.value, idx)} />
                  <input type="text" placeholder="Company" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={exp.company} onChange={(e) => handleInputChange("experience", "company", e.target.value, idx)} />
                  <input type="text" placeholder="Duration" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={exp.duration} onChange={(e) => handleInputChange("experience", "duration", e.target.value, idx)} />
                </div>
              ))}
              <button onClick={addExperience} className="text-indigo-400 font-semibold flex items-center gap-2">+ Add More</button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-4">
                  <input type="text" placeholder="Degree" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={edu.degree} onChange={(e) => handleInputChange("education", "degree", e.target.value, idx)} />
                  <input type="text" placeholder="School" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={edu.school} onChange={(e) => handleInputChange("education", "school", e.target.value, idx)} />
                  <input type="text" placeholder="Year" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500" value={edu.year} onChange={(e) => handleInputChange("education", "year", e.target.value, idx)} />
                </div>
              ))}
              <button onClick={addEducation} className="text-indigo-400 font-semibold flex items-center gap-2">+ Add More</button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <textarea 
                placeholder="React, Node.js, Python, Team Management..." 
                className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          )}

          <div className="flex justify-between mt-12">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {currentStep < 3 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-8 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 font-bold"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={generateResume}
                disabled={loading}
                className="px-8 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/20"
              >
                {loading ? "Generating..." : "Generate AI Resume"} <Sparkles className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Live Preview / AI Result */}
        <div className="sticky top-24">
            <ResumePreview data={generatedResume || formData} isAI={!!generatedResume} />
        </div>
      </div>
    </div>
  );
}

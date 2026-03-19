"use client";

import { useRef } from "react";
import { Download, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ResumePreviewProps {
  data: any;
  isAI: boolean;
}

export default function ResumePreview({ data, isAI }: ResumePreviewProps) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const renderContent = () => {
    if (isAI && data) {
      return (
        <div className="space-y-8">
          {/* Summary */}
          <div>
            <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Professional Summary</h3>
            <p className="text-slate-700 leading-relaxed">{data.summary || data.rawText}</p>
          </div>

          {/* Experience */}
          {data.experience && Array.isArray(data.experience) && (
            <div>
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Experience</h3>
              <div className="space-y-6">
                {data.experience.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.role}</span>
                      <span>{exp.duration}</span>
                    </div>
                    <div className="text-indigo-600 font-semibold mb-2">{exp.company}</div>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {exp.bulletPoints?.map((bp: string, i: number) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills && (
            <div>
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 text-slate-700">
                {Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default Raw Data Preview
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{data.personal.name || "Your Name"}</h1>
          <p className="text-slate-500 mt-2">{data.personal.email} | {data.personal.phone} | {data.personal.location}</p>
        </div>
        <div className="bg-slate-100 p-6 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 text-center">
            AI Content will appear here after generation.
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" /> Live Preview
        </h2>
        {isAI && (
          <button 
            onClick={() => handlePrint()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      <div className="bg-white text-slate-900 p-10 shadow-2xl rounded-sm min-h-[800px] border border-slate-200" ref={componentRef}>
        {renderContent()}
      </div>
    </div>
  );
}

import ResumeForm from "@/components/resume/ResumeForm";

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">AI Resume Maker</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Fill in your details and let our AI craft a world-class resume for you in seconds.</p>
      </div>
      <ResumeForm />
    </div>
  );
}

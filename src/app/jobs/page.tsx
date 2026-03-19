import JobSearch from "@/components/jobs/JobSearch";

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">AI Job Matcher</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Skip the searching. Let Firecrawl & AI find the perfect roles for you across the web.</p>
      </div>
      <JobSearch />
    </div>
  );
}

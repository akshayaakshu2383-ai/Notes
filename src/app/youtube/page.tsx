import YoutubeSummarizer from "@/components/youtube/YoutubeSummarizer";

export default function YoutubePage() {
  return (
    <div className="min-h-screen">
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">AI YouTube Summariser</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Skip the fluff. Get the meat. AI-powered summaries for any YouTube video instantly.</p>
      </div>
      <YoutubeSummarizer />
    </div>
  );
}

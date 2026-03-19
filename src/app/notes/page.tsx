import NotesSaver from "@/components/notes/NotesSaver";

export default function NotesPage() {
  return (
    <div className="min-h-screen">
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Secure Notes Saver</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Capture your ideas, snippets, and thoughts. Everything is synced to your private cloud storage.</p>
      </div>
      <NotesSaver />
    </div>
  );
}

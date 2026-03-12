import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "@/components/mirror-notes/IntroScreen";
import MirrorScreen from "@/components/mirror-notes/MirrorScreen";
import ReflectionScreen from "@/components/mirror-notes/ReflectionScreen";
import CompletionScreen from "@/components/mirror-notes/CompletionScreen";
import SavedNotesScreen from "@/components/mirror-notes/SavedNotesScreen";
import { toast } from "sonner";

type Screen = "intro" | "mirror" | "reflection" | "completion" | "saved";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("intro");
  const [notes, setNotes] = useState<string[]>([]);

  const handleAddNote = useCallback((text: string) => {
    setNotes((prev) => [...prev, text]);
  }, []);

  const handleSave = useCallback(() => {
    const existing = JSON.parse(localStorage.getItem("mirror-notes") || "[]");
    const merged = [...new Set([...existing, ...notes])];
    localStorage.setItem("mirror-notes", JSON.stringify(merged));
    toast.success("Notes saved!");
    setScreen("saved");
  }, [notes]);

  const handleViewSaved = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem("mirror-notes") || "[]");
    setNotes((prev) => {
      const merged = [...new Set([...saved, ...prev])];
      return merged;
    });
    setScreen("saved");
  }, []);

  const handleAddMore = useCallback(() => {
    setScreen("mirror");
  }, []);

  const handleBack = useCallback(() => {
    setNotes([]);
    setScreen("intro");
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {screen === "intro" && (
          <IntroScreen key="intro" onStart={() => setScreen("mirror")} />
        )}
        {screen === "mirror" && (
          <MirrorScreen
            key="mirror"
            notes={notes}
            onAddNote={handleAddNote}
            onContinue={() => setScreen("reflection")}
          />
        )}
        {screen === "reflection" && (
          <ReflectionScreen
            key="reflection"
            notes={notes}
            onContinue={() => setScreen("completion")}
          />
        )}
        {screen === "completion" && (
          <CompletionScreen
            key="completion"
            notes={notes}
            onSave={handleSave}
            onAddMore={handleAddMore}
            onViewSaved={handleViewSaved}
          />
        )}
        {screen === "saved" && (
          <SavedNotesScreen
            key="saved"
            notes={notes}
            onAddMore={handleAddMore}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

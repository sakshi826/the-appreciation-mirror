import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "@/components/mirror-notes/IntroScreen";
import MirrorScreen from "@/components/mirror-notes/MirrorScreen";
import ReflectionScreen from "@/components/mirror-notes/ReflectionScreen";
import CompletionScreen from "@/components/mirror-notes/CompletionScreen";
import SavedNotesScreen from "@/components/mirror-notes/SavedNotesScreen";
import { toast } from "sonner";

type Screen = "intro" | "mirror" | "reflection" | "completion" | "saved";

const Index = () => {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<Screen>("intro");
  const [notes, setNotes] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing notes from the database on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) return;

        const res = await fetch("/api/notes", {
          headers: { "x-user-id": userId }
        });
        if (res.ok) {
          const data = await res.json();
          setNotes(data || []);
        }
      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = useCallback((text: string) => {
    setNotes((prev) => [...prev, text]);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const userId = sessionStorage.getItem("user_id");
      if (!userId) throw new Error("No user ID");

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": userId 
        },
        body: JSON.stringify({ notes })
      });

      if (res.ok) {
        toast.success(t("notesSaved"));
        setScreen("saved");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      toast.error("Error saving notes to server");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [notes, t]);

  const handleViewSaved = useCallback(() => {
    setScreen("saved");
  }, []);

  const handleAddMore = useCallback(() => {
    setScreen("mirror");
  }, []);

  const handleBack = useCallback(() => {
    setScreen("intro");
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pride-bg relative z-0">
      <div className="relative z-10">
      <AnimatePresence mode="wait">
        {screen === "intro" && (
          <IntroScreen key="intro" onStart={() => setScreen("mirror")} onBack={handleBack} />
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
    </div>
  );
};

export default Index;

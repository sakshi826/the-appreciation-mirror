import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddNoteModal from "./AddNoteModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MirrorScreenProps {
  notes: string[];
  onAddNote: (text: string) => void;
  onContinue: () => void;
}

const NOTE_COLORS = ["note-red", "note-orange", "note-yellow", "note-green", "note-blue", "note-purple"] as const;

// Predefined positions (percentage-based) for notes on the mirror
const NOTE_POSITIONS = [
  { top: "8%", left: "10%", rotate: -5 },
  { top: "5%", left: "55%", rotate: 4 },
  { top: "30%", left: "5%", rotate: -3 },
  { top: "28%", left: "58%", rotate: 6 },
  { top: "52%", left: "8%", rotate: -4 },
  { top: "50%", left: "52%", rotate: 3 },
  { top: "72%", left: "15%", rotate: -6 },
  { top: "70%", left: "50%", rotate: 5 },
];

const MirrorScreen = ({ notes, onAddNote, onContinue }: MirrorScreenProps) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (text: string) => {
    onAddNote(text);
    setModalOpen(false);
  };

  const filledCount = notes.length;
  const prompt =
    filledCount === 0
      ? t("writeAppreciation")
      : filledCount < 3
        ? t("mirrorFilling")
        : t("mirrorFull");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-5 py-6"
    >
      <p className="text-sm text-muted-foreground text-center font-body mb-1 font-medium">{prompt}</p>

      {filledCount === 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-3 mt-1">
          {[
            t("hint1"),
            t("hint2"),
            t("hint3"),
          ].map((hint, i) => (
            <span key={i} className="text-[10px] bg-secondary text-secondary-foreground px-3 py-1 rounded-full italic">
              "{hint}"
            </span>
          ))}
        </div>
      )}

      {/* Mirror with notes on it */}
      <div className="relative w-full max-w-xs mx-auto mt-3 mb-6">
        <div className="w-full aspect-[3/4] rounded-[2rem] bg-mirror border-2 border-border relative overflow-hidden">
          {/* Sparkle when empty */}
          {filledCount === 0 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/50 font-reflection">✨</span>
          )}

          {/* Notes placed on the mirror */}
          <AnimatePresence>
            {notes.map((text, i) => {
              const pos = NOTE_POSITIONS[i % NOTE_POSITIONS.length];
              const color = NOTE_COLORS[i % NOTE_COLORS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`${color} absolute w-[38%] aspect-square rounded-lg shadow-md p-2 flex items-center justify-center`}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    rotate: `${pos.rotate}deg`,
                  }}
                >
                  <p className="font-reflection text-[10px] leading-tight text-foreground text-center break-words px-1">
                    {text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Note Button */}
      {filledCount < 8 && (
        <Button
          variant="mirror"
          size="lg"
          onClick={() => setModalOpen(true)}
          className="px-8 mb-4 py-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addNote")}
        </Button>
      )}

      {filledCount >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="outline" size="lg" onClick={onContinue} className="px-8 rounded-full py-6">
            {t("continueToReflection")}
          </Button>
        </motion.div>
      )}

      <AddNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

export default MirrorScreen;

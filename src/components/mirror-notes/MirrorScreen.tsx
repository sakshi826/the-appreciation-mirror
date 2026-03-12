import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StickyNote from "./StickyNote";
import AddNoteModal from "./AddNoteModal";
import { Button } from "@/components/ui/button";

interface MirrorScreenProps {
  notes: string[];
  onAddNote: (text: string) => void;
  onContinue: () => void;
}

const TOTAL_SLOTS = 8;

const MirrorScreen = ({ notes, onAddNote, onContinue }: MirrorScreenProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  const handleSlotClick = (index: number) => {
    if (!notes[index]) {
      setActiveSlot(index);
      setModalOpen(true);
    }
  };

  const handleSubmit = (text: string) => {
    onAddNote(text);
    setModalOpen(false);
  };

  const filledCount = notes.length;
  const prompt =
    filledCount === 0
      ? "Write something you appreciate about yourself."
      : filledCount < 3
        ? "Your mirror is starting to fill with appreciation."
        : "Your mirror is filling with appreciation.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-5 py-8"
    >
      <p className="text-sm text-muted-foreground text-center font-body mb-1">{prompt}</p>

      {filledCount === 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4 mt-2">
          {[
            "I keep trying even when things are hard.",
            "I care deeply about people.",
            "I'm learning to accept myself.",
          ].map((hint, i) => (
            <span key={i} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full italic">
              "{hint}"
            </span>
          ))}
        </div>
      )}

      {/* Mirror + Notes */}
      <div className="relative w-full max-w-xs mx-auto mt-4 mb-8">
        {/* Mirror */}
        <div className="w-full aspect-[3/4] rounded-[2rem] bg-mirror border-2 border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50 font-reflection">✨</span>
        </div>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto mb-8">
        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
          <StickyNote
            key={i}
            index={i}
            text={notes[i]}
            onClick={() => handleSlotClick(i)}
          />
        ))}
      </div>

      {filledCount >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="mirror" size="lg" onClick={onContinue} className="px-8">
            Continue to Reflection
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

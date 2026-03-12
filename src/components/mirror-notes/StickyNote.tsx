import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const NOTE_COLORS = ["note-red", "note-orange", "note-yellow", "note-green", "note-blue", "note-purple"] as const;

interface StickyNoteProps {
  index: number;
  text?: string;
  onClick: () => void;
}

const StickyNote = ({ index, text, onClick }: StickyNoteProps) => {
  const color = NOTE_COLORS[index % NOTE_COLORS.length];
  const rotation = ((index * 7 + 3) % 13) - 6; // deterministic slight tilt

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} w-full aspect-square rounded-xl shadow-md p-3 flex items-center justify-center cursor-pointer transition-shadow hover:shadow-lg`}
      style={{ rotate: `${rotation}deg` }}
    >
      {text ? (
        <p className="font-reflection text-sm text-foreground leading-snug text-center break-words">
          {text}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <Plus className="w-5 h-5" />
          <span className="text-xs font-body">Add Note</span>
        </div>
      )}
    </motion.button>
  );
};

export default StickyNote;

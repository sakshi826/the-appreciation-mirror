import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Save, Plus } from "lucide-react";
import StickyNote from "./StickyNote";

interface CompletionScreenProps {
  notes: string[];
  onSave: () => void;
  onAddMore: () => void;
  onViewSaved: () => void;
}

const CompletionScreen = ({ notes, onSave, onAddMore, onViewSaved }: CompletionScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-5 py-8"
    >
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-3 text-center">
        Beautiful 🌟
      </h2>
      <p className="text-sm text-muted-foreground text-center text-justify max-w-xs mb-6 leading-relaxed">
        Even on difficult days, these qualities remain a part of you.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto mb-8">
        {notes.map((text, i) => (
          <StickyNote key={i} index={i} text={text} onClick={() => {}} />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="mirror" size="lg" onClick={onSave} className="w-full py-5">
          <Save className="w-4 h-4 mr-2" />
          Save My Notes
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onAddMore}
          className="w-full py-5 rounded-full border-primary/30 text-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Notes
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={onViewSaved}
          className="w-full py-5 rounded-full text-muted-foreground"
        >
          View Saved Notes
        </Button>
      </div>
    </motion.div>
  );
};

export default CompletionScreen;

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StickyNote from "./StickyNote";

interface ReflectionScreenProps {
  notes: string[];
  onContinue: () => void;
}

const ReflectionScreen = ({ notes, onContinue }: ReflectionScreenProps) => {
  const [reflection, setReflection] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-5 py-8"
    >
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-3 text-center">
        Your Mirror
      </h2>
      <p className="text-sm text-muted-foreground text-center text-justify max-w-xs mb-6 leading-relaxed">
        Take a moment to read these notes. They reflect parts of you that deserve appreciation.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto mb-8">
        {notes.map((text, i) => (
          <StickyNote key={i} index={i} text={text} onClick={() => {}} />
        ))}
      </div>

      <div className="w-full max-w-xs mb-6">
        <p className="text-sm text-muted-foreground mb-2 text-justify">
          How did it feel to acknowledge these parts of yourself?
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your thoughts… (optional)"
          className="w-full h-24 rounded-xl border border-input bg-background p-3 text-sm font-reflection text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <Button variant="mirror" size="lg" onClick={onContinue} className="px-8">
        Continue
      </Button>
    </motion.div>
  );
};

export default ReflectionScreen;

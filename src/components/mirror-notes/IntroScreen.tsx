import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center"
    >
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-3xl font-heading font-semibold text-foreground mb-4"
      >
        Mirror Notes
      </motion.h1>

      <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-sm text-justify">
        Sometimes we notice our flaws easily but forget to acknowledge our strengths.
        This activity invites you to leave small notes of appreciation for yourself.
      </p>

      {/* Mirror illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="relative w-52 h-64 mb-10"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-mirror border-2 border-border" />
        {/* Empty sticky notes */}
        {[
          { color: "note-yellow", rotate: -6, top: "10%", left: "-15%" },
          { color: "note-mint", rotate: 4, top: "35%", right: "-18%" },
          { color: "note-blue", rotate: -3, bottom: "8%", left: "-10%" },
        ].map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
            className={`absolute w-14 h-14 ${note.color} rounded-lg shadow-md`}
            style={{
              rotate: `${note.rotate}deg`,
              top: note.top,
              bottom: note.bottom,
              left: note.left,
              right: note.right,
            }}
          />
        ))}
      </motion.div>

      <Button variant="mirror" size="lg" onClick={onStart} className="px-10 py-6 text-base">
        Start Activity
      </Button>
    </motion.div>
  );
};

export default IntroScreen;

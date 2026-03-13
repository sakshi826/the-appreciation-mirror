import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import StickyNote from "./StickyNote";
import { useTranslation } from "react-i18next";

interface SavedNotesScreenProps {
  notes: string[];
  onAddMore: () => void;
  onBack: () => void;
}

const SavedNotesScreen = ({ notes, onAddMore, onBack }: SavedNotesScreenProps) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-5 py-8"
    >
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-1 text-center">
        {t("myMirrorNotes")}
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {t("yourReflections")}
      </p>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-10">{t("noNotesSaved")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mx-auto mb-8">
          {notes.map((text, i) => (
            <StickyNote key={i} index={i} text={text} onClick={() => {}} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs mt-auto">
        <Button variant="mirror" size="lg" onClick={onAddMore} className="w-full py-6">
          <Plus className="w-4 h-4 mr-2" />
          {t("addMoreNotes")}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="w-full py-6 rounded-full text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("backToHome")}
        </Button>
      </div>
    </motion.div>
  );
};

export default SavedNotesScreen;

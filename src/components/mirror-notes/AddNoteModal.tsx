import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const AddNoteModal = ({ open, onClose, onSubmit }: AddNoteModalProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  const EXAMPLES = [
    t("proudResilience"),
    t("listenEmpathy"),
    t("trustMyself"),
    t("hint1"),
    t("hint2"),
  ];

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm px-4 pb-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">{t("addANote")}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4 text-justify">
              {t("whatOneThing")}
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("writeYourNote")}
              className="w-full h-24 rounded-xl border border-input bg-background p-3 text-sm font-reflection text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-3"
            />

            <div className="flex flex-wrap gap-2 mb-5">
              {EXAMPLES.slice(0, 3).map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setText(ex)}
                  className="text-[10px] bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>

            <Button
              variant="mirror"
              className="w-full py-6"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              {t("placeNote")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddNoteModal;

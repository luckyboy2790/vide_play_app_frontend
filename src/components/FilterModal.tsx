import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { playTypes, formations } from "@/constants/playOptions";
import { useEffect, useState } from "react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  selectedFormation: string | null;
  selectedPlayType: string | null;
  onSelectFormation: (value: string) => void;
  onSelectPlayType: (value: string) => void;
  onApply: (formation: string, playType: string) => void;
}

const FilterModal = ({
  open,
  onClose,
  selectedFormation,
  selectedPlayType,
  onSelectFormation,
  onSelectPlayType,
  onApply,
}: FilterModalProps) => {
  const [tempFormation, setTempFormation] = useState<string | null>(
    selectedFormation
  );
  const [tempPlayType, setTempPlayType] = useState<string | null>(
    selectedPlayType
  );

  useEffect(() => {
    if (open) {
      setTempFormation(selectedFormation);
      setTempPlayType(selectedPlayType);
    }
  }, [open, selectedFormation, selectedPlayType]);

  const handleApply = () => {
    onApply(tempFormation || "", tempPlayType || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Filters</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-semibold mb-1">Formation</p>
            <div className="grid grid-cols-2 gap-2">
              {formations.map((f) => (
                <Button
                  key={f.value}
                  variant={tempFormation === f.value ? "default" : "outline"}
                  onClick={() => setTempFormation(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Play Type</p>
            <div className="grid grid-cols-2 gap-2">
              {playTypes.map((pt) => (
                <Button
                  key={pt.value}
                  variant={tempPlayType === pt.value ? "default" : "outline"}
                  onClick={() => setTempPlayType(pt.value)}
                >
                  {pt.label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleApply}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;

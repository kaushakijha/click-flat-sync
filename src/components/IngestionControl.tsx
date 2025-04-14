
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface IngestionControlProps {
  onStart: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  status: "idle" | "ingesting" | "completed" | "error";
}

const IngestionControl = ({ onStart, onCancel, disabled, status }: IngestionControlProps) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate progress updates when status is "ingesting"
  useState(() => {
    let interval: number | null = null;
    
    if (status === "ingesting") {
      interval = window.setInterval(() => {
        setProgress(p => {
          const newProgress = p + 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 500);
    } else if (status === "completed") {
      setProgress(100);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  });
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          onClick={onStart}
          disabled={disabled || status === "ingesting"}
          className="bg-green-600 hover:bg-green-700"
        >
          {status === "ingesting" ? "Ingesting..." : "Start Ingestion"}
        </Button>
        
        {onCancel && (
          <Button
            onClick={onCancel}
            disabled={status !== "ingesting"}
            variant="outline"
          >
            Cancel
          </Button>
        )}
      </div>
      
      {status === "ingesting" || status === "completed" ? (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500 text-right">{Math.round(progress)}%</div>
        </div>
      ) : null}
    </div>
  );
};

export default IngestionControl;

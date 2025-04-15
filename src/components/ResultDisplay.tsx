import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultDisplayProps {
  recordCount: number;
  progress?: number;
}

const ResultDisplay = ({ recordCount, progress = 100 }: ResultDisplayProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-green-700 font-medium">
          Successfully processed {recordCount.toLocaleString()} records
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;


import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ResultDisplayProps {
  recordCount: number;
}

const ResultDisplay = ({ recordCount }: ResultDisplayProps) => {
  return (
    <div className="mt-6">
      <Card className="bg-green-50 p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-green-800 mb-2">
          Ingestion Successful
        </h3>
        <div className="text-4xl font-bold text-green-700 mb-2">
          {recordCount.toLocaleString()}
        </div>
        <p className="text-green-600">
          Records successfully transferred
        </p>
      </Card>
    </div>
  );
};

export default ResultDisplay;

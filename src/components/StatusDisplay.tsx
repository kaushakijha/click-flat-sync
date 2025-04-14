
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

interface StatusDisplayProps {
  status: "idle" | "connecting" | "fetching" | "ingesting" | "completed" | "error";
  error: string | null;
}

const StatusDisplay = ({ status, error }: StatusDisplayProps) => {
  if (status === "idle" && !error) {
    return (
      <Alert className="bg-gray-50">
        <Clock className="h-5 w-5" />
        <AlertTitle>Ready</AlertTitle>
        <AlertDescription>
          Configure your data source and target to begin ingestion.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "connecting") {
    return (
      <Alert className="bg-blue-50">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-600">Connecting</AlertTitle>
        <AlertDescription>
          Establishing connection to your data source...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "fetching") {
    return (
      <Alert className="bg-blue-50">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-600">Fetching</AlertTitle>
        <AlertDescription>
          Loading schema and sample data from source...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "ingesting") {
    return (
      <Alert className="bg-blue-50">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-600">Ingesting</AlertTitle>
        <AlertDescription>
          Transferring data between source and target...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "completed") {
    return (
      <Alert className="bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-600">Completed</AlertTitle>
        <AlertDescription>
          Data ingestion completed successfully.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-600">Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default StatusDisplay;

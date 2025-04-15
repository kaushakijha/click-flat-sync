import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultDisplayProps {
  recordCount: number;
  timeTaken?: number;
  status?: "success" | "error" | "in_progress";
  error?: string;
  progress?: number;
  sourceType?: "clickhouse" | "flatfile";
  targetType?: "clickhouse" | "flatfile";
  operationType?: "export" | "import" | "join";
}

export function ResultDisplay({
  recordCount,
  timeTaken = 0,
  status = "success",
  error,
  progress,
  sourceType = "clickhouse",
  targetType = "flatfile",
  operationType = "export",
}: ResultDisplayProps) {
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "in_progress":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getOperationDescription = (): string => {
    const source = sourceType === "clickhouse" ? "ClickHouse" : "Flat File";
    const target = targetType === "clickhouse" ? "ClickHouse" : "Flat File";

    switch (operationType) {
      case "export":
        return `Export from ${source} to ${target}`;
      case "import":
        return `Import from ${source} to ${target}`;
      case "join":
        return `Join operation on ${source}`;
      default:
        return "Operation";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Operation Type */}
          <div>
            <h3 className="text-lg font-semibold">
              {getOperationDescription()}
            </h3>
          </div>

          {/* Status */}
          <div>
            <p className={`font-medium ${getStatusColor(status)}`}>
              Status: {status?.toUpperCase() || "UNKNOWN"}
            </p>
          </div>

          {/* Progress Bar */}
          {status === "in_progress" && progress !== undefined && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>
          )}

          {/* Results */}
          {status === "success" && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                Successfully processed {recordCount.toLocaleString()} records
              </p>
              {timeTaken > 0 && (
                <p className="text-gray-600">
                  Time taken: {formatTime(timeTaken)}
                </p>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 rounded-md">
              <p className="text-red-600 font-medium">Error occurred:</p>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Additional Details */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Operation Details:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Source: {sourceType}</li>
              <li>Target: {targetType}</li>
              <li>Operation: {operationType}</li>
              <li>Started at: {new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

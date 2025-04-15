import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface OperationDetailsProps {
  operation: {
    id: string;
    timestamp: string;
    operationType: "export" | "import" | "join";
    sourceType: "clickhouse" | "flatfile";
    targetType: "clickhouse" | "flatfile";
    status: "success" | "error" | "in_progress";
    recordCount?: number;
    timeTaken?: number;
    error?: string;
    progress?: number;
    details?: {
      sourceConfig?: Record<string, any>;
      targetConfig?: Record<string, any>;
      selectedTables?: string[];
      selectedColumns?: string[];
    };
  };
}

export function OperationDetails({ operation }: OperationDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderConfigDetails = (config: Record<string, any>, title: string) => {
    if (!config) return null;
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">{title}</h4>
        <div className="bg-gray-50 p-3 rounded-md">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}:</span>{" "}
              <span className="text-gray-600">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Operation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium">
                  {operation.operationType.toUpperCase()}
                </span>
                {getStatusBadge(operation.status)}
              </div>
              <span className="text-sm text-gray-500">
                {formatTime(operation.timestamp)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-2">Source</h4>
                <p className="text-sm text-gray-600">{operation.sourceType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-2">Target</h4>
                <p className="text-sm text-gray-600">{operation.targetType}</p>
              </div>
            </div>

            {operation.status === "in_progress" &&
              operation.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      {operation.progress}%
                    </span>
                  </div>
                  <Progress value={operation.progress} />
                </div>
              )}

            {operation.recordCount && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-2">Results</h4>
                <p className="text-sm">
                  Records Processed: {operation.recordCount.toLocaleString()}
                </p>
                {operation.timeTaken && (
                  <p className="text-sm">
                    Time Taken: {(operation.timeTaken / 1000).toFixed(2)}s
                  </p>
                )}
              </div>
            )}

            {operation.error && (
              <div className="bg-red-50 p-3 rounded-md">
                <h4 className="font-medium mb-2 text-red-700">Error</h4>
                <p className="text-sm text-red-600">{operation.error}</p>
              </div>
            )}

            {operation.details && (
              <>
                {renderConfigDetails(
                  operation.details.sourceConfig,
                  "Source Configuration"
                )}
                {renderConfigDetails(
                  operation.details.targetConfig,
                  "Target Configuration"
                )}
                {operation.details.selectedTables && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Tables</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {operation.details.selectedTables.map((table) => (
                        <div key={table} className="text-sm">
                          {table}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {operation.details.selectedColumns && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Columns</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {operation.details.selectedColumns.map((column) => (
                        <div key={column} className="text-sm">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

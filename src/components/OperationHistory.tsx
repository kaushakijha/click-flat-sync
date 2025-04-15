import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface OperationLog {
  id: string;
  timestamp: string;
  operationType: "export" | "import" | "join";
  sourceType: "clickhouse" | "flatfile";
  targetType: "clickhouse" | "flatfile";
  status: "success" | "error" | "in_progress";
  recordCount?: number;
  timeTaken?: number;
  error?: string;
}

interface OperationHistoryProps {
  logs: OperationLog[];
  onSelectLog: (log: OperationLog) => void;
}

export function OperationHistory({ logs, onSelectLog }: OperationHistoryProps) {
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

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Operation History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectLog(log)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {log.operationType.toUpperCase()}
                    </span>
                    {getStatusBadge(log.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    From: {log.sourceType} → To: {log.targetType}
                  </p>
                  {log.recordCount && (
                    <p>Records: {log.recordCount.toLocaleString()}</p>
                  )}
                  {log.timeTaken && (
                    <p>Time: {(log.timeTaken / 1000).toFixed(2)}s</p>
                  )}
                  {log.error && (
                    <p className="text-red-500 mt-2">Error: {log.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

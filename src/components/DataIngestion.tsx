import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TableSelection } from "@/components/TableSelection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface ClickHouseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  jwtToken: string;
}

interface FlatFileConfig {
  fileName: string;
  delimiter: string;
}

interface Column {
  name: string;
  selected: boolean;
}

export function DataIngestion() {
  const { token } = useAuth();
  const [source, setSource] = useState<"clickhouse" | "flatfile">("clickhouse");
  const [clickHouseConfig, setClickHouseConfig] = useState<ClickHouseConfig>({
    host: "",
    port: "9440",
    database: "",
    user: "",
    jwtToken: token || "",
  });
  const [flatFileConfig, setFlatFileConfig] = useState<FlatFileConfig>({
    fileName: "",
    delimiter: ",",
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "ingesting" | "completed" | "error"
  >("idle");
  const [recordCount, setRecordCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [joinCondition, setJoinCondition] = useState<string>("");

  const handleConnect = async () => {
    setStatus("Connecting...");
    setError("");
    try {
      if (source === "clickhouse") {
        // TODO: Implement ClickHouse connection
        setStatus("Connected to ClickHouse");
      } else {
        // TODO: Implement Flat File connection
        setStatus("Connected to Flat File");
      }
    } catch (err) {
      setError("Connection failed: " + (err as Error).message);
      setStatus("Error");
    }
  };

  const handleLoadColumns = async () => {
    setStatus("Loading columns...");
    setError("");
    try {
      if (source === "clickhouse") {
        // TODO: Implement ClickHouse column fetching
        setAvailableColumns(["column1", "column2", "column3"]);
      } else {
        // TODO: Implement Flat File column detection
        setAvailableColumns(["column1", "column2", "column3"]);
      }
      setStatus("Columns loaded");
    } catch (err) {
      setError("Failed to load columns: " + (err as Error).message);
      setStatus("Error");
    }
  };

  const handleTableSelect = (tables: string[]) => {
    setSelectedTables(tables);
    // Mock fetching columns for selected tables
    if (tables.length > 0) {
      const mockColumns: Column[] = [
        { name: "id", selected: true },
        { name: "price", selected: true },
        { name: "date", selected: true },
        { name: "postcode", selected: true },
        { name: "property_type", selected: true },
        { name: "is_new", selected: true },
      ];
      setColumns(mockColumns);
    } else {
      setColumns([]);
    }
  };

  const handleStartIngestion = () => {
    if (selectedTables.length === 0) {
      setError("Please select at least one table");
      return;
    }

    if (selectedTables.length > 1 && !joinCondition) {
      setError("Please enter a join condition when selecting multiple tables");
      return;
    }

    setStatus("ingesting");
    setProgress(0);
    setError(null);

    // Mock ingestion process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("completed");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Data Ingestion Tool</h1>

        {/* Source Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Select Data Source</h2>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                source === "clickhouse"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSource("clickhouse")}
            >
              ClickHouse
            </button>
            <button
              className={`px-4 py-2 rounded ${
                source === "flatfile" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSource("flatfile")}
            >
              Flat File
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          {source === "clickhouse" ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Host"
                value={clickHouseConfig.host}
                onChange={(e) =>
                  setClickHouseConfig({
                    ...clickHouseConfig,
                    host: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Port"
                value={clickHouseConfig.port}
                onChange={(e) =>
                  setClickHouseConfig({
                    ...clickHouseConfig,
                    port: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Database"
                value={clickHouseConfig.database}
                onChange={(e) =>
                  setClickHouseConfig({
                    ...clickHouseConfig,
                    database: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="User"
                value={clickHouseConfig.user}
                onChange={(e) =>
                  setClickHouseConfig({
                    ...clickHouseConfig,
                    user: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="JWT Token"
                value={clickHouseConfig.jwtToken}
                onChange={(e) =>
                  setClickHouseConfig({
                    ...clickHouseConfig,
                    jwtToken: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="File Name"
                value={flatFileConfig.fileName}
                onChange={(e) =>
                  setFlatFileConfig({
                    ...flatFileConfig,
                    fileName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Delimiter"
                value={flatFileConfig.delimiter}
                onChange={(e) =>
                  setFlatFileConfig({
                    ...flatFileConfig,
                    delimiter: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Table Selection */}
        {source === "clickhouse" && (
          <Card>
            <CardHeader>
              <CardTitle>Table Selection</CardTitle>
              <CardDescription>
                Select one or more tables to use as data source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableSelection
                tables={["table1", "table2", "table3"]}
                selectedTables={selectedTables}
                onSelect={handleTableSelect}
              />
            </CardContent>
          </Card>
        )}

        {/* Join Condition */}
        {source === "clickhouse" && selectedTables.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Join Condition</CardTitle>
              <CardDescription>
                Enter the condition to join the selected tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="Example: table1.id = table2.id AND table2.category = table3.category"
                  value={joinCondition}
                  onChange={(e) => setJoinCondition(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-500">
                  Use SQL join syntax. Example: table1.id = table2.id
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect
            </button>
            <button
              onClick={handleLoadColumns}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load Columns
            </button>
            <button
              onClick={handleStartIngestion}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Start Ingestion
            </button>
          </div>
        </div>

        {/* Status and Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status and Results</h2>
          {status && <p className="mb-2">Status: {status}</p>}
          {error && <p className="text-red-500 mb-2">Error: {error}</p>}
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          {recordCount > 0 && (
            <p className="text-green-600">
              Total records processed: {recordCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

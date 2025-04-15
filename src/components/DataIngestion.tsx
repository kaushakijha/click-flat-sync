import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

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
  const [status, setStatus] = useState<string>("");
  const [recordCount, setRecordCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

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

  const handleStartIngestion = async () => {
    setStatus("Ingesting data...");
    setError("");
    setProgress(0);
    try {
      // TODO: Implement data ingestion
      setProgress(100);
      setRecordCount(1000); // Example count
      setStatus("Ingestion completed");
    } catch (err) {
      setError("Ingestion failed: " + (err as Error).message);
      setStatus("Error");
    }
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

        {/* Column Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Column Selection</h2>
          <div className="grid grid-cols-3 gap-4">
            {availableColumns.map((column) => (
              <label key={column} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedColumns([...selectedColumns, column]);
                    } else {
                      setSelectedColumns(
                        selectedColumns.filter((c) => c !== column)
                      );
                    }
                  }}
                  className="form-checkbox"
                />
                <span>{column}</span>
              </label>
            ))}
          </div>
        </div>

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

import { useState } from "react";
import SourceSelection from "@/components/SourceSelection";
import ClickHouseConfig from "@/components/ClickHouseConfig";
import FlatFileConfig from "@/components/FlatFileConfig";
import { TableSelection } from "@/components/TableSelection";
import ColumnSelection from "@/components/ColumnSelection";
import IngestionControl from "@/components/IngestionControl";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusDisplay from "@/components/StatusDisplay";

const Index = () => {
  // Define source and target types
  const [sourceType, setSourceType] = useState<
    "clickhouse" | "flatfile" | null
  >(null);
  const [targetType, setTargetType] = useState<
    "clickhouse" | "flatfile" | null
  >(null);

  // ClickHouse connection config
  const [clickhouseConfig, setClickhouseConfig] = useState({
    host: "",
    port: "",
    database: "",
    user: "",
    jwtToken: "",
  });

  // Flat file config
  const [flatFileConfig, setFlatFileConfig] = useState({
    fileName: "",
    delimiter: ",",
  });

  // Tables and columns state
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [columns, setColumns] = useState<{ name: string; selected: boolean }[]>(
    []
  );

  // Preview data
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Status and results
  const [status, setStatus] = useState<
    "idle" | "connecting" | "fetching" | "ingesting" | "completed" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Add join state
  const [joinCondition, setJoinCondition] = useState<string>("");
  const [showJoinInput, setShowJoinInput] = useState<boolean>(false);

  const handleSourceChange = (type: "clickhouse" | "flatfile") => {
    setSourceType(type);
    // Reset target if it's the same as the new source
    if (targetType === type) {
      setTargetType(null);
    }
  };

  const handleTargetChange = (type: "clickhouse" | "flatfile") => {
    setTargetType(type);
  };

  const handleClickHouseConfigChange = (config: any) => {
    setClickhouseConfig(config);
  };

  const handleFlatFileConfigChange = (config: any) => {
    setFlatFileConfig(config);
  };

  const handleConnect = async () => {
    setStatus("connecting");
    setError(null);

    try {
      // Mock API call for now - would connect to backend
      console.log("Connecting to source:", sourceType);

      // Simulate successful connection
      setTimeout(() => {
        if (sourceType === "clickhouse") {
          setAvailableTables(["uk_price_paid", "ontime", "visits", "users"]);
        } else {
          // For flat file, we'd process the file and identify columns
          setColumns([
            { name: "id", selected: true },
            { name: "name", selected: true },
            { name: "email", selected: true },
            { name: "date", selected: true },
            { name: "value", selected: true },
          ]);
        }
        setStatus("idle");
      }, 1000);
    } catch (e) {
      setError("Connection failed. Please check your configuration.");
      setStatus("error");
    }
  };

  const handleTableSelect = (tables: string[]) => {
    setSelectedTables(tables);
    // Show join input if multiple tables are selected
    setShowJoinInput(tables.length > 1);

    // Mock fetching columns for selected tables
    setStatus("fetching");
    setTimeout(() => {
      const mockColumns = [
        { name: "id", selected: true },
        { name: "price", selected: true },
        { name: "date", selected: true },
        { name: "postcode", selected: true },
        { name: "property_type", selected: true },
        { name: "is_new", selected: true },
      ];
      setColumns(mockColumns);
      setStatus("idle");
    }, 800);
  };

  const handleColumnToggle = (columnName: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.name === columnName ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const handlePreview = async () => {
    setStatus("fetching");
    setError(null);

    try {
      // Mock API call for preview data
      setTimeout(() => {
        let mockData;

        if (selectedTables.length > 1 && joinCondition) {
          // Simulate joined data
          mockData = Array(5)
            .fill(null)
            .map((_, idx) => ({
              id: `${idx + 1}`,
              table1_id: `${idx + 1}`,
              table2_id: `${idx + 1}`,
              price: Math.floor(Math.random() * 1000000),
              date: new Date().toISOString().split("T")[0],
              postcode: `AB${idx + 1} ${idx}CD`,
              property_type: [
                "detached",
                "semi-detached",
                "terraced",
                "flat",
                "other",
              ][idx],
              is_new: idx % 2 === 0,
              // Add joined fields
              category: ["residential", "commercial", "industrial"][idx % 3],
              location: [
                "London",
                "Manchester",
                "Birmingham",
                "Leeds",
                "Glasgow",
              ][idx],
              joined_date: new Date().toISOString().split("T")[0],
            }));

          console.log("Preview data with join condition:", joinCondition);
        } else {
          // Regular single table data
          mockData = Array(5)
            .fill(null)
            .map((_, idx) => ({
              id: `${idx + 1}`,
              price: Math.floor(Math.random() * 1000000),
              date: new Date().toISOString().split("T")[0],
              postcode: `AB${idx + 1} ${idx}CD`,
              property_type: [
                "detached",
                "semi-detached",
                "terraced",
                "flat",
                "other",
              ][idx],
              is_new: idx % 2 === 0,
            }));
        }

        setPreviewData(mockData);
        setStatus("idle");
      }, 1000);
    } catch (e) {
      setError("Failed to fetch preview data");
      setStatus("error");
    }
  };

  // Add a function to test join condition
  const handleTestJoin = () => {
    if (!joinCondition) {
      setError("Please enter a join condition first");
      return;
    }

    setStatus("fetching");
    setError(null);

    // Simulate testing the join condition
    setTimeout(() => {
      try {
        // Basic validation of join condition
        if (!joinCondition.includes("=")) {
          throw new Error("Invalid join condition format");
        }

        // Log the join condition for verification
        console.log("Testing join condition:", joinCondition);
        console.log("Selected tables:", selectedTables);

        // Simulate successful join test
        setStatus("idle");
        alert(
          "Join condition is valid! Check the preview data to see the joined results."
        );

        // Automatically trigger preview to show joined data
        handlePreview();
      } catch (err) {
        setError(`Join test failed: ${(err as Error).message}`);
        setStatus("error");
      }
    }, 1000);
  };

  const handleStartIngestion = async () => {
    setStatus("ingesting");
    setError(null);
    setRecordCount(null);
    setProgress(0);

    try {
      // Mock ingestion process with progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setRecordCount(1250);
            setStatus("completed");
            return 100;
          }
          return newProgress;
        });
      }, 500);
    } catch (e) {
      setError(
        "Ingestion failed. Please check your configuration and try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          ClickHouse & Flat File Data Ingestion Tool
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Transfer data between ClickHouse and flat files with ease
        </p>
      </header>

      <Tabs defaultValue="configuration" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Source</CardTitle>
                <CardDescription>
                  Select and configure your data source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SourceSelection
                  type="source"
                  selected={sourceType}
                  onChange={handleSourceChange}
                  disabledOption={targetType}
                />

                {sourceType === "clickhouse" && (
                  <ClickHouseConfig
                    config={clickhouseConfig}
                    onChange={handleClickHouseConfigChange}
                  />
                )}

                {sourceType === "flatfile" && (
                  <FlatFileConfig
                    config={flatFileConfig}
                    onChange={handleFlatFileConfigChange}
                  />
                )}

                {sourceType && (
                  <div className="mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      onClick={handleConnect}
                      disabled={status === "connecting"}
                    >
                      {status === "connecting"
                        ? "Connecting..."
                        : "Connect to Source"}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Target</CardTitle>
                <CardDescription>
                  Select and configure your data target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SourceSelection
                  type="target"
                  selected={targetType}
                  onChange={handleTargetChange}
                  disabledOption={sourceType}
                />

                {targetType === "clickhouse" && (
                  <ClickHouseConfig
                    config={clickhouseConfig}
                    onChange={handleClickHouseConfigChange}
                  />
                )}

                {targetType === "flatfile" && (
                  <FlatFileConfig
                    config={flatFileConfig}
                    onChange={handleFlatFileConfigChange}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Table Selection</CardTitle>
                  <CardDescription>
                    Select one or more tables to use as data source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TableSelection
                    tables={availableTables}
                    selectedTables={selectedTables}
                    onSelect={handleTableSelect}
                  />
                </CardContent>
              </Card>
            )}

            {/* Join Condition Card */}
            {showJoinInput && (
              <Card>
                <CardHeader>
                  <CardTitle>Join Configuration</CardTitle>
                  <CardDescription>
                    Specify how to join the selected tables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="joinCondition"
                        className="text-sm font-medium"
                      >
                        Join Condition
                      </label>
                      <textarea
                        id="joinCondition"
                        value={joinCondition}
                        onChange={(e) => setJoinCondition(e.target.value)}
                        placeholder="Example: table1.id = table2.id AND table2.category = table3.category"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                      />
                      <p className="text-sm text-gray-500">
                        Use SQL join syntax to specify how tables should be
                        joined.
                      </p>
                      <button
                        onClick={handleTestJoin}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        disabled={!joinCondition || status === "fetching"}
                      >
                        Test Join
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {columns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Column Selection</CardTitle>
                  <CardDescription>
                    Select the columns to include in the ingestion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ColumnSelection
                    columns={columns}
                    onToggle={handleColumnToggle}
                  />
                  <div className="mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mr-2"
                      onClick={handlePreview}
                      disabled={status === "fetching"}
                    >
                      {status === "fetching" ? "Loading..." : "Preview Data"}
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      onClick={handleStartIngestion}
                      disabled={
                        status === "ingesting" ||
                        !sourceType ||
                        !targetType ||
                        (showJoinInput && !joinCondition) // Disable if join condition is required but not provided
                      }
                    >
                      {status === "ingesting"
                        ? "Ingesting..."
                        : "Start Ingestion"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {previewData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Showing first {previewData.length} records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(previewData[0]).map(
                          (key) =>
                            columns.find((col) => col.name === key)
                              ?.selected && (
                              <th key={key} className="border p-2 text-left">
                                {key}
                              </th>
                            )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          {Object.entries(row).map(
                            ([key, value]) =>
                              columns.find((col) => col.name === key)
                                ?.selected && (
                                <td key={key} className="border p-2">
                                  {String(value)}
                                </td>
                              )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>No preview data available yet</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Connect to a data source, select a table and columns, then
                  click "Preview Data" to see sample records.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Ingestion Results</CardTitle>
              <CardDescription>
                View the results of your data ingestion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusDisplay status={status} error={error} />
              {status === "ingesting" && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-right">
                    {progress}%
                  </p>
                </div>
              )}
              {recordCount !== null && (
                <ResultDisplay
                  recordCount={recordCount}
                  status={
                    status === "completed"
                      ? "success"
                      : status === "error"
                      ? "error"
                      : "in_progress"
                  }
                  error={error || undefined}
                  progress={status === "ingesting" ? progress : undefined}
                  sourceType={sourceType || undefined}
                  targetType={targetType || undefined}
                  operationType="export"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

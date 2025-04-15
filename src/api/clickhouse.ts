import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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

interface JoinConfig {
  tables: string[];
  joinCondition: string;
}

export const clickHouseService = {
  // Connection Management
  async connect(config: ClickHouseConfig): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/connect`, config);
      return response.data.success;
    } catch (error) {
      throw new Error("Connection failed: " + (error as Error).message);
    }
  },

  // Schema Discovery
  async getTables(config: ClickHouseConfig): Promise<string[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/get-tables`, config);
      return response.data.tables;
    } catch (error) {
      throw new Error("Failed to fetch tables: " + (error as Error).message);
    }
  },

  async getColumns(config: ClickHouseConfig, table: string): Promise<string[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/get-columns`, {
        ...config,
        table,
      });
      return response.data.columns;
    } catch (error) {
      throw new Error("Failed to fetch columns: " + (error as Error).message);
    }
  },

  // Data Preview
  async previewData(
    config: ClickHouseConfig,
    table: string,
    columns: string[],
    limit: number = 100
  ): Promise<any[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/preview-data`, {
        ...config,
        table,
        columns,
        limit,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        "Failed to fetch preview data: " + (error as Error).message
      );
    }
  },

  // Data Ingestion
  async exportToFlatFile(
    config: ClickHouseConfig,
    table: string,
    columns: string[],
    targetConfig: FlatFileConfig
  ): Promise<{ recordCount: number; timeTaken: number }> {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${API_BASE_URL}/export`, {
        sourceConfig: config,
        table,
        columns,
        targetConfig,
      });
      const timeTaken = Date.now() - startTime;
      return {
        recordCount: response.data.recordCount,
        timeTaken,
      };
    } catch (error) {
      throw new Error("Export failed: " + (error as Error).message);
    }
  },

  async importFromFlatFile(
    config: ClickHouseConfig,
    sourceConfig: FlatFileConfig,
    targetTable: string,
    columns: string[]
  ): Promise<{ recordCount: number; timeTaken: number }> {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${API_BASE_URL}/import`, {
        targetConfig: config,
        sourceConfig,
        targetTable,
        columns,
      });
      const timeTaken = Date.now() - startTime;
      return {
        recordCount: response.data.recordCount,
        timeTaken,
      };
    } catch (error) {
      throw new Error("Import failed: " + (error as Error).message);
    }
  },

  // Join Operations
  async executeJoin(
    config: ClickHouseConfig,
    joinConfig: JoinConfig,
    columns: string[]
  ): Promise<any[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/join`, {
        config,
        joinConfig,
        columns,
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Join operation failed: " + (error as Error).message);
    }
  },

  // Progress Monitoring
  async getStatus(taskId: string): Promise<{
    status: string;
    progress: number;
    recordCount: number;
    error?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get status: " + (error as Error).message);
    }
  },
};

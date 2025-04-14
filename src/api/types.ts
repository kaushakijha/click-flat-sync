
// API Types for communication between frontend and backend

export interface ClickHouseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  jwtToken: string;
}

export interface FlatFileConfig {
  fileName: string;
  delimiter: string;
}

export interface SourceConfig {
  type: "clickhouse" | "flatfile";
  clickhouseConfig?: ClickHouseConfig;
  flatFileConfig?: FlatFileConfig;
}

export interface TargetConfig {
  type: "clickhouse" | "flatfile";
  clickhouseConfig?: ClickHouseConfig;
  flatFileConfig?: FlatFileConfig;
}

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface ConnectionRequest {
  source: SourceConfig;
}

export interface ConnectionResponse {
  success: boolean;
  tables?: Table[];
  columns?: Column[];
  error?: string;
}

export interface PreviewRequest {
  source: SourceConfig;
  table?: string;
  columns: string[];
  limit: number;
}

export interface PreviewResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

export interface IngestionRequest {
  source: SourceConfig;
  target: TargetConfig;
  table?: string;
  columns: string[];
}

export interface IngestionResponse {
  success: boolean;
  recordCount?: number;
  error?: string;
}

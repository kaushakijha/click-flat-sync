
import { 
  ConnectionRequest, 
  ConnectionResponse, 
  PreviewRequest, 
  PreviewResponse, 
  IngestionRequest, 
  IngestionResponse 
} from './types';

// This would be the actual client that communicates with the Java backend
// For now, we'll use mock implementation and switch to this when the backend is ready

const API_BASE_URL = "http://localhost:8080/api";

export const connectToSource = async (request: ConnectionRequest): Promise<ConnectionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: 'Network error: Failed to connect to source'
    };
  }
};

export const getTableColumns = async (
  source: ConnectionRequest['source'], 
  tableName: string
): Promise<ConnectionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source, tableName }),
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: 'Network error: Failed to fetch columns'
    };
  }
};

export const getPreview = async (request: PreviewRequest): Promise<PreviewResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: 'Network error: Failed to fetch preview data'
    };
  }
};

export const startIngestion = async (request: IngestionRequest): Promise<IngestionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: 'Network error: Failed to complete ingestion'
    };
  }
};

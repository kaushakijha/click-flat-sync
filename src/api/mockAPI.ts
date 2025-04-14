
import { 
  ConnectionRequest, 
  ConnectionResponse, 
  PreviewRequest, 
  PreviewResponse, 
  IngestionRequest, 
  IngestionResponse 
} from './types';

// Mock API functions for frontend development
// These would be replaced with actual API calls to the Java backend

export const connectToSource = async (request: ConnectionRequest): Promise<ConnectionResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    if (request.source.type === 'clickhouse') {
      // Mock response for ClickHouse
      return {
        success: true,
        tables: [
          { 
            name: 'uk_price_paid', 
            columns: [
              { name: 'id', type: 'String' },
              { name: 'price', type: 'UInt32' },
              { name: 'date', type: 'Date' },
              { name: 'postcode', type: 'String' },
              { name: 'property_type', type: 'String' },
              { name: 'is_new', type: 'UInt8' },
            ]
          },
          { 
            name: 'ontime', 
            columns: [
              { name: 'Year', type: 'UInt16' },
              { name: 'Quarter', type: 'UInt8' },
              { name: 'Month', type: 'UInt8' },
              { name: 'DayofMonth', type: 'UInt8' },
              { name: 'FlightDate', type: 'Date' },
              { name: 'Carrier', type: 'String' },
              { name: 'FlightNum', type: 'String' },
              { name: 'Origin', type: 'String' },
              { name: 'Dest', type: 'String' },
            ]
          }
        ]
      };
    } else {
      // Mock response for Flat File
      return {
        success: true,
        columns: [
          { name: 'id', type: 'String' },
          { name: 'name', type: 'String' },
          { name: 'email', type: 'String' },
          { name: 'date', type: 'String' },
          { name: 'value', type: 'String' },
        ]
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to connect to source'
    };
  }
};

export const getTableColumns = async (
  source: ConnectionRequest['source'], 
  tableName: string
): Promise<ConnectionResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Mock columns data based on table name
    if (tableName === 'uk_price_paid') {
      return {
        success: true,
        columns: [
          { name: 'id', type: 'String' },
          { name: 'price', type: 'UInt32' },
          { name: 'date', type: 'Date' },
          { name: 'postcode', type: 'String' },
          { name: 'property_type', type: 'String' },
          { name: 'is_new', type: 'UInt8' },
        ]
      };
    } else if (tableName === 'ontime') {
      return {
        success: true,
        columns: [
          { name: 'Year', type: 'UInt16' },
          { name: 'Quarter', type: 'UInt8' },
          { name: 'Month', type: 'UInt8' },
          { name: 'DayofMonth', type: 'UInt8' },
          { name: 'FlightDate', type: 'Date' },
          { name: 'Carrier', type: 'String' },
          { name: 'FlightNum', type: 'String' },
          { name: 'Origin', type: 'String' },
          { name: 'Dest', type: 'String' },
        ]
      };
    } else {
      return {
        success: false,
        error: 'Table not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch columns'
    };
  }
};

export const getPreview = async (request: PreviewRequest): Promise<PreviewResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Generate mock data based on the columns
    const mockData = Array(request.limit || 5).fill(null).map((_, idx) => {
      const row: Record<string, any> = {};
      
      request.columns.forEach(col => {
        if (col === 'id' || col === 'Year') {
          row[col] = idx + 1;
        } else if (col === 'price') {
          row[col] = Math.floor(Math.random() * 1000000);
        } else if (col === 'date' || col === 'FlightDate') {
          row[col] = new Date().toISOString().split('T')[0];
        } else if (col === 'postcode') {
          row[col] = `AB${idx + 1} ${idx}CD`;
        } else if (col === 'property_type') {
          row[col] = ["detached", "semi-detached", "terraced", "flat", "other"][idx % 5];
        } else if (col === 'is_new') {
          row[col] = idx % 2 === 0;
        } else if (col === 'name') {
          row[col] = `User ${idx + 1}`;
        } else if (col === 'email') {
          row[col] = `user${idx + 1}@example.com`;
        } else if (col === 'value') {
          row[col] = Math.floor(Math.random() * 100);
        } else {
          row[col] = `Value ${idx + 1}`;
        }
      });
      
      return row;
    });
    
    return {
      success: true,
      data: mockData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch preview data'
    };
  }
};

export const startIngestion = async (request: IngestionRequest): Promise<IngestionResponse> => {
  // Simulate API delay and processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Mock successful ingestion
    return {
      success: true,
      recordCount: Math.floor(Math.random() * 5000) + 1000
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to complete ingestion'
    };
  }
};

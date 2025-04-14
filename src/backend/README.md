
# ClickHouse & Flat File Data Ingestion Tool - Backend

This is the backend implementation for the data ingestion tool. It's built with Java and handles the bidirectional data transfer between ClickHouse and flat files.

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── dataingest/
│   │   │           ├── controller/    # REST API controllers
│   │   │           ├── service/       # Business logic
│   │   │           ├── model/         # Data models
│   │   │           ├── repository/    # Data access
│   │   │           ├── config/        # App configuration
│   │   │           └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
└── pom.xml
```

## Core Components

1. **ClickHouseConnector** - Manages connections to ClickHouse databases using JWT authentication.
2. **FlatFileHandler** - Handles reading from and writing to flat files (CSV, TSV, etc.).
3. **DataTransferService** - Orchestrates data movement between sources and targets.
4. **APIController** - Exposes REST endpoints for the frontend to interact with.

## Implementation Notes

### ClickHouse Client

The backend uses the official ClickHouse JDBC driver to connect to ClickHouse databases. JWT token authentication is handled by setting the appropriate connection properties.

Example connection code:
```java
Properties properties = new Properties();
properties.setProperty("user", user);
properties.setProperty("password", jwtToken);
properties.setProperty("ssl", "true");
properties.setProperty("sslmode", "STRICT");

String url = "jdbc:clickhouse://" + host + ":" + port + "/" + database;
Connection connection = DriverManager.getConnection(url, properties);
```

### Flat File Processing

The backend uses Java's built-in file I/O capabilities to read and write flat files. It supports various delimiter formats and handles large files efficiently through streaming.

### Data Transfer Logic

1. When transferring from ClickHouse to a flat file:
   - Execute SQL query with selected columns
   - Stream results to a file writer
   - Count records processed

2. When transferring from a flat file to ClickHouse:
   - Parse the file schema
   - Create table in ClickHouse if needed
   - Stream data from file to ClickHouse in batches
   - Count records processed

## API Endpoints

The backend exposes the following REST endpoints:

- `POST /api/connect` - Test connection to source and list tables/columns
- `POST /api/columns` - Get columns for a specific table
- `POST /api/preview` - Get sample data from source
- `POST /api/ingest` - Execute data transfer between source and target

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on port 8080 by default.

## Testing

Run the tests with:

```bash
mvn test
```

There are test cases for each component as well as integration tests for the entire data transfer workflow.


# ClickHouse & Flat File Bidirectional Data Ingestion Tool

This project implements a web-based application that enables bidirectional data transfer between ClickHouse databases and flat files. The application provides a user-friendly interface for configuring connections, selecting data sources and targets, and executing data transfers.

## Features

- Bidirectional data transfer:
  - ClickHouse → Flat File
  - Flat File → ClickHouse
- Source and target selection with intuitive UI
- ClickHouse connection with JWT token authentication
- Table and column selection
- Data preview capability
- Progress tracking and completion reporting
- Error handling and user-friendly messages

## Project Structure

The project consists of two main components:

### Frontend (React/TypeScript)

- Modern UI built with React and TypeScript
- Interface for configuring connections and viewing results
- Responsive design using Tailwind CSS
- Real-time status updates

### Backend (Java)

- RESTful API for handling data transfer operations
- ClickHouse integration using JDBC driver
- Flat file parsing and generation
- Efficient data handling with batch processing

## Setup and Installation

### Prerequisites

- Node.js and npm for frontend development
- Java JDK 11+ and Maven for backend development
- ClickHouse instance (local or remote)

### Frontend Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the server:
   ```bash
   mvn spring-boot:run
   ```

## Usage

1. Open the application in a web browser
2. Choose a data source (ClickHouse or Flat File)
3. Configure the connection parameters
4. Select the target for data ingestion
5. Choose tables and columns to transfer
6. Preview the data (optional)
7. Start the ingestion process
8. View the results and record count

## Testing

For testing the application, you can use:

- ClickHouse example datasets like `uk_price_paid` and `ontime`
- Sample CSV files included in the `testdata` directory

## Development

This project was developed using:

- React with TypeScript for the frontend
- Java Spring Boot for the backend
- Tailwind CSS for styling
- shadcn/ui for component library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

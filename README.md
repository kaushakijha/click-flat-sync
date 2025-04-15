# Click-Flat-Sync

A modern web application for synchronizing data between ClickHouse and flat files (CSV/TSV). Built with Spring Boot and React.

## Features

- Connect to ClickHouse databases
- Export data from ClickHouse to CSV/TSV files
- Import data from CSV/TSV files to ClickHouse
- Join multiple tables with custom conditions
- Modern, responsive UI built with React
- Docker support for easy deployment

## Project Structure

```
click-flat-sync/
├── src/
│   ├── backend/                 # Spring Boot backend
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/       # Java source code
│   │   │   │   └── resources/  # Configuration files
│   │   │   └── test/           # Test files
│   │   └── pom.xml             # Maven dependencies
│   │
│   └── frontend/               # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── services/       # API services
│       │   └── App.tsx         # Main application
│       ├── package.json        # NPM dependencies
│       └── vite.config.ts      # Vite configuration
│
├── data/                       # Directory for exported files
├── docker-compose.yml          # Docker Compose configuration
├── init-clickhouse.sql         # Sample data initialization
└── README.md                   # This file
```

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Docker and Docker Compose
- Maven
- npm or yarn

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/click-flat-sync.git
   cd click-flat-sync
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - ClickHouse: http://localhost:8123

### Manual Setup

1. Start ClickHouse:

   ```bash
   docker run -d --name clickhouse -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server
   ```

2. Initialize the database:

   ```bash
   cat init-clickhouse.sql | curl 'http://localhost:8123/' --data-binary @-
   ```

3. Start the backend:

   ```bash
   cd src/backend
   mvn spring-boot:run
   ```

4. Start the frontend:
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```

## Configuration

### ClickHouse Connection

The application supports the following ClickHouse connection parameters:

- Host
- Port
- Database
- Username
- Password
- JWT Token (optional)

### File Export/Import

- Supported formats: CSV, TSV
- Configurable delimiter
- Column selection
- Custom file naming

## Testing

### Backend Tests

```bash
cd src/backend
mvn test
```

### Frontend Tests

```bash
cd src/frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ClickHouse](https://clickhouse.com/) - The column-oriented database management system
- [Spring Boot](https://spring.io/projects/spring-boot) - The backend framework
- [React](https://reactjs.org/) - The frontend library
- [Vite](https://vitejs.dev/) - The frontend build tool

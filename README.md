# Click-Flat-Sync: Enterprise Data Synchronization Platform

A sophisticated, full-stack data synchronization platform that enables seamless bidirectional data transfer between ClickHouse databases and flat files (CSV/TSV). Built with Spring Boot and React, this enterprise-grade solution addresses critical data integration challenges.

## 🚀 Features

### Core Functionality

- **Bidirectional Data Transfer**
  - ClickHouse → Flat File (CSV/TSV)
  - Flat File (CSV/TSV) → ClickHouse
- **Multi-Table Join Support**
  - Visual join condition builder
  - Real-time join preview
  - Optimized join execution
- **Schema Management**
  - Automatic schema discovery
  - Column type mapping
  - Custom column selection

### Security & Authentication

- JWT Authentication
- HTTPS encryption
- Secure credential storage
- Role-based access control

### User Experience

- Modern, responsive UI
- Real-time progress tracking
- Intuitive data preview
- Comprehensive error handling

## 🛠️ Technical Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components

### Backend

- Spring Boot 3.x
- Java 17
- ClickHouse JDBC
- JWT Authentication

### Infrastructure

- Docker
- Docker Compose
- Nginx (for production)

## 📦 Project Structure

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

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Docker and Docker Compose
- Maven
- npm or yarn

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

## 🔧 Configuration

### ClickHouse Connection

```yaml
host: localhost
port: 8123
database: default
user: default
jwtToken: your-jwt-token
```

### File Export/Import

- Supported formats: CSV, TSV
- Configurable delimiter
- Column selection
- Custom file naming

## 🧪 Testing

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

## 📚 API Documentation

### Endpoints

#### Connection Management

- `POST /api/connect` - Test database connection
- `GET /api/tables` - List available tables
- `GET /api/columns/{table}` - Get table columns

#### Data Operations

- `POST /api/export` - Export data to flat file
- `POST /api/import` - Import data from flat file
- `POST /api/join` - Join multiple tables
- `GET /api/preview` - Preview data

#### Status & Monitoring

- `GET /api/status/{operationId}` - Get operation status
- `GET /api/history` - Get operation history

## 🐳 Docker Configuration

### Docker Compose

```yaml
version: "3.8"

services:
  frontend:
    build: ./src/frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8080
    depends_on:
      - backend

  backend:
    build: ./src/backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:clickhouse://clickhouse:8123/default
    depends_on:
      - clickhouse

  clickhouse:
    image: clickhouse/clickhouse-server
    ports:
      - "8123:8123"
      - "9000:9000"
    volumes:
      - ./init-clickhouse.sql:/docker-entrypoint-initdb.d/init.sql
```

### Environment Variables

```bash
# Frontend
VITE_API_URL=http://localhost:8080

# Backend
SPRING_DATASOURCE_URL=jdbc:clickhouse://clickhouse:8123/default
SPRING_DATASOURCE_USERNAME=default
SPRING_DATASOURCE_PASSWORD=default
```

## 🔒 Security

### Authentication

- JWT-based authentication
- Token expiration
- Refresh token mechanism

### Data Protection

- HTTPS encryption
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Monitoring

### Logging

- Operation history
- Error tracking
- Performance metrics
- User activity

### Metrics

- Transfer speed
- Success rate
- Error rate
- Resource usage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin main`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ClickHouse](https://clickhouse.com/) - The column-oriented database management system
- [Spring Boot](https://spring.io/projects/spring-boot) - The backend framework
- [React](https://reactjs.org/) - The frontend library
- [Vite](https://vitejs.dev/) - The frontend build tool

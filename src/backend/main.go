package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type ClickHouseConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Database string `json:"database"`
	User     string `json:"user"`
	JWTToken string `json:"jwtToken"`
}

type FlatFileConfig struct {
	FileName  string `json:"fileName"`
	Delimiter string `json:"delimiter"`
}

type ColumnInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type IngestionRequest struct {
	Source         string   `json:"source"`
	ClickHouse     *ClickHouseConfig `json:"clickHouse,omitempty"`
	FlatFile       *FlatFileConfig   `json:"flatFile,omitempty"`
	SelectedColumns []string `json:"selectedColumns"`
}

type IngestionResponse struct {
	RecordCount int    `json:"recordCount"`
	Error       string `json:"error,omitempty"`
}

func main() {
	r := mux.NewRouter()

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Routes
	r.HandleFunc("/api/connect", handleConnect).Methods("POST")
	r.HandleFunc("/api/columns", handleGetColumns).Methods("POST")
	r.HandleFunc("/api/ingest", handleIngest).Methods("POST")

	// Wrap router with CORS middleware
	handler := c.Handler(r)

	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func handleConnect(w http.ResponseWriter, r *http.Request) {
	var config struct {
		Source string          `json:"source"`
		Config json.RawMessage `json:"config"`
	}

	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var response struct {
		Success bool   `json:"success"`
		Error   string `json:"error,omitempty"`
	}

	if config.Source == "clickhouse" {
		var chConfig ClickHouseConfig
		if err := json.Unmarshal(config.Config, &chConfig); err != nil {
			response.Error = "Invalid ClickHouse configuration"
			json.NewEncoder(w).Encode(response)
			return
		}

		// Test ClickHouse connection
		conn, err := connectToClickHouse(chConfig)
		if err != nil {
			response.Error = err.Error()
			json.NewEncoder(w).Encode(response)
			return
		}
		defer conn.Close()

		response.Success = true
	} else if config.Source == "flatfile" {
		var ffConfig FlatFileConfig
		if err := json.Unmarshal(config.Config, &ffConfig); err != nil {
			response.Error = "Invalid Flat File configuration"
			json.NewEncoder(w).Encode(response)
			return
		}

		// Test Flat File access
		if _, err := os.Stat(ffConfig.FileName); os.IsNotExist(err) {
			response.Error = "File not found"
			json.NewEncoder(w).Encode(response)
			return
		}

		response.Success = true
	}

	json.NewEncoder(w).Encode(response)
}

func handleGetColumns(w http.ResponseWriter, r *http.Request) {
	var config struct {
		Source string          `json:"source"`
		Config json.RawMessage `json:"config"`
	}

	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var columns []ColumnInfo

	if config.Source == "clickhouse" {
		var chConfig ClickHouseConfig
		if err := json.Unmarshal(config.Config, &chConfig); err != nil {
			http.Error(w, "Invalid ClickHouse configuration", http.StatusBadRequest)
			return
		}

		conn, err := connectToClickHouse(chConfig)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer conn.Close()

		// Get table columns
		rows, err := conn.Query("SELECT name, type FROM system.columns WHERE database = ?", chConfig.Database)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var col ColumnInfo
			if err := rows.Scan(&col.Name, &col.Type); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			columns = append(columns, col)
		}
	} else if config.Source == "flatfile" {
		var ffConfig FlatFileConfig
		if err := json.Unmarshal(config.Config, &ffConfig); err != nil {
			http.Error(w, "Invalid Flat File configuration", http.StatusBadRequest)
			return
		}

		file, err := os.Open(ffConfig.FileName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		reader := csv.NewReader(file)
		reader.Comma = rune(ffConfig.Delimiter[0])

		headers, err := reader.Read()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		for _, header := range headers {
			columns = append(columns, ColumnInfo{Name: header, Type: "string"})
		}
	}

	json.NewEncoder(w).Encode(columns)
}

func handleIngest(w http.ResponseWriter, r *http.Request) {
	var req IngestionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var response IngestionResponse

	if req.Source == "clickhouse" {
		if req.ClickHouse == nil {
			response.Error = "ClickHouse configuration is required"
			json.NewEncoder(w).Encode(response)
			return
		}

		conn, err := connectToClickHouse(*req.ClickHouse)
		if err != nil {
			response.Error = err.Error()
			json.NewEncoder(w).Encode(response)
			return
		}
		defer conn.Close()

		// TODO: Implement ClickHouse to Flat File ingestion
		response.RecordCount = 1000 // Example count
	} else if req.Source == "flatfile" {
		if req.FlatFile == nil {
			response.Error = "Flat File configuration is required"
			json.NewEncoder(w).Encode(response)
			return
		}

		// TODO: Implement Flat File to ClickHouse ingestion
		response.RecordCount = 1000 // Example count
	}

	json.NewEncoder(w).Encode(response)
}

func connectToClickHouse(config ClickHouseConfig) (driver.Conn, error) {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{fmt.Sprintf("%s:%s", config.Host, config.Port)},
		Auth: clickhouse.Auth{
			Database: config.Database,
			Username: config.User,
		},
		Settings: clickhouse.Settings{
			"jwt_token": config.JWTToken,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to ClickHouse: %v", err)
	}

	if err := conn.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping ClickHouse: %v", err)
	}

	return conn, nil
} 
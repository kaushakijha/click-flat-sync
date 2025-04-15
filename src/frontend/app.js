document.addEventListener("DOMContentLoaded", function () {
  // UI Elements
  const sourceTypeRadios = document.getElementsByName("sourceType");
  const targetTypeRadios = document.getElementsByName("targetType");
  const clickhouseConfig = document.getElementById("clickhouseConfig");
  const flatFileConfig = document.getElementById("flatFileConfig");
  const connectBtn = document.getElementById("connectBtn");
  const startIngestionBtn = document.getElementById("startIngestionBtn");
  const resultMessage = document.getElementById("resultMessage");
  const progressBar = document.querySelector(".progress-bar");
  const columnSelection = document.getElementById("columnSelection");
  const tableSelection = document.getElementById("tableSelection");
  const previewTable = document.getElementById("previewTable");

  // Event Listeners
  sourceTypeRadios.forEach((radio) => {
    radio.addEventListener("change", handleSourceTypeChange);
  });

  targetTypeRadios.forEach((radio) => {
    radio.addEventListener("change", handleTargetTypeChange);
  });

  connectBtn.addEventListener("click", handleConnect);
  startIngestionBtn.addEventListener("click", handleIngestion);

  // Handle source type change
  function handleSourceTypeChange(e) {
    if (e.target.value === "clickhouse") {
      clickhouseConfig.style.display = "block";
      flatFileConfig.style.display = "none";
      tableSelection.style.display = "block";
    } else {
      clickhouseConfig.style.display = "none";
      flatFileConfig.style.display = "block";
      tableSelection.style.display = "none";
    }
  }

  // Handle target type change
  function handleTargetTypeChange(e) {
    const targetConfig = document.getElementById("targetConfig");
    if (e.target.value === "clickhouse") {
      targetConfig.innerHTML = `
                <div class="mb-3">
                    <label class="form-label">Target Table Name</label>
                    <input type="text" class="form-control" id="targetTable">
                </div>
            `;
    } else {
      targetConfig.innerHTML = `
                <div class="mb-3">
                    <label class="form-label">Output File Name</label>
                    <input type="text" class="form-control" id="outputFile" value="output.csv">
                </div>
            `;
    }
  }

  // Handle connect button click
  const API_BASE_URL = "http://localhost:8080/api";
  const CLICKHOUSE_URL = "http://localhost:8123";

  async function handleConnect() {
    const sourceType = document.querySelector(
      'input[name="sourceType"]:checked'
    ).value;

    try {
      if (sourceType === "clickhouse") {
        const config = {
          host: document.getElementById("host").value,
          port: document.getElementById("port").value,
          database: document.getElementById("database").value,
          user: document.getElementById("username").value,
          jwtToken: document.getElementById("jwtToken").value,
        };

        // Test connection
        const response = await fetch(`${API_BASE_URL}/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          throw new Error("Connection failed");
        }

        // Get tables
        const tablesResponse = await fetch(`${API_BASE_URL}/tables`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        const tables = await tablesResponse.json();
        populateTableSelection(tables);
      } else {
        const file = document.getElementById("flatFile").files[0];
        if (!file) {
          throw new Error("Please select a file");
        }
        const columns = await readCSVColumns(file);
        populateColumnSelection(columns);
      }

      showSuccess("Connected successfully!");
    } catch (error) {
      console.error("Connection error:", error);
      showError(error.message);
    }
  }

  // Handle ingestion button click
  async function handleIngestion() {
    const sourceType = document.querySelector(
      'input[name="sourceType"]:checked'
    ).value;
    const targetType = document.querySelector(
      'input[name="targetType"]:checked'
    ).value;

    try {
      updateProgress(0);

      if (sourceType === "clickhouse") {
        await handleClickHouseIngestion(targetType);
      } else {
        await handleFlatFileIngestion(targetType);
      }

      showSuccess("Ingestion completed successfully!");
      updateProgress(100);
    } catch (error) {
      showError("Ingestion failed: " + error.message);
    }
  }

  // Handle ClickHouse ingestion
  async function handleClickHouseIngestion(targetType) {
    const config = {
      clickHouseConfig: {
        host: document.getElementById("host").value,
        port: parseInt(document.getElementById("port").value),
        database: document.getElementById("database").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        jwtToken: document.getElementById("jwtToken").value,
      },
      tables: Array.from(document.getElementById("tables").selectedOptions).map(
        (opt) => opt.value
      ),
      joinCondition: document.getElementById("joinCondition").value,
      selectedColumns: getSelectedColumns(),
    };

    if (targetType === "flatfile") {
      const outputFile = document.getElementById("outputFile").value;
      const exportRequest = {
        config: {
          host: document.getElementById("host").value,
          port: document.getElementById("port").value,
          database: document.getElementById("database").value,
          user: document.getElementById("username").value,
          jwtToken: document.getElementById("jwtToken").value,
        },
        columns: getSelectedColumns(),
        outputFile: outputFile,
      };

      const response = await fetch(`${API_BASE_URL}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Export failed");
      }
    } else {
      config.targetTable = document.getElementById("targetTable").value;
      const response = await fetch(`${API_BASE_URL}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }
    }
  }

  // Handle Flat File ingestion
  async function handleFlatFileIngestion(targetType) {
    const file = document.getElementById("flatFile").files[0];
    if (!file) {
      throw new Error("Please select a file");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("delimiter", document.getElementById("delimiter").value);
    formData.append("columns", JSON.stringify(getSelectedColumns()));

    if (targetType === "clickhouse") {
      formData.append(
        "targetTable",
        document.getElementById("targetTable").value
      );
      const response = await fetch(`${API_BASE_URL}/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }
    }
  }

  // Helper functions
  function showSuccess(message) {
    resultMessage.innerHTML = `<div class="alert alert-success">${message}</div>`;
  }

  function showError(message) {
    resultMessage.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }

  function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", percent);
  }

  function populateTableSelection(tables) {
    const select = document.getElementById("tables");
    select.innerHTML = tables
      .map((table) => `<option value="${table}">${table}</option>`)
      .join("");
  }

  function populateColumnSelection(columns) {
    columnSelection.innerHTML = columns
      .map(
        (column) => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${column}" id="col_${column}">
                <label class="form-check-label" for="col_${column}">${column}</label>
            </div>
        `
      )
      .join("");
  }

  function getSelectedColumns() {
    return Array.from(
      document.querySelectorAll("#columnSelection input:checked")
    ).map((input) => input.value);
  }

  async function readCSVColumns(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const firstLine = e.target.result.split("\n")[0];
        const columns = firstLine.split(
          document.getElementById("delimiter").value
        );
        resolve(columns);
      };
      reader.readAsText(file);
    });
  }
});

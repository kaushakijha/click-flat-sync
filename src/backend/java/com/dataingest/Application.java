
package com.dataingest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class Application {
    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    
    public static void main(String[] args) {
        try {
            // Load the ClickHouse JDBC driver
            Class.forName("com.clickhouse.jdbc.ClickHouseDriver");
            logger.info("ClickHouse JDBC driver loaded successfully");
        } catch (ClassNotFoundException e) {
            logger.error("Failed to load ClickHouse JDBC driver", e);
        }
        
        SpringApplication.run(Application.class, args);
    }
}

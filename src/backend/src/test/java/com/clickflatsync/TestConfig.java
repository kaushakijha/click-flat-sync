package com.clickflatsync;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import com.clickflatsync.service.ClickHouseService;
import com.clickflatsync.service.JoinService;
import com.clickflatsync.service.DataTransferService;
import org.mockito.Mockito;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public ClickHouseService clickHouseService() {
        return Mockito.mock(ClickHouseService.class);
    }

    @Bean
    @Primary
    public JoinService joinService(ClickHouseService clickHouseService) {
        return new JoinService(clickHouseService);
    }

    @Bean
    @Primary
    public DataTransferService dataTransferService(ClickHouseService clickHouseService) {
        return new DataTransferService(clickHouseService);
    }
}
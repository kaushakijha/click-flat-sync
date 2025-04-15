package com.clickflatsync.model;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ConnectionRequest {
    @NotBlank(message = "Source is required")
    private String source;

    @NotNull(message = "Configuration is required")
    private Object config;
}
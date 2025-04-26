package com.example.ukrdamagereport.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Slf4j
@Service
public class DataBaseService {

    @Retryable(value = {SQLException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000))
    public void performDatabaseOperation() throws SQLException {
    }

    @Recover
    public void recover(SQLException e) {
        log.error("Database operation failed after all retry attempts: " + e.getMessage());
    }
}
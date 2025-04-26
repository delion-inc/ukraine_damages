package com.example.ukrdamagereport.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.util.UUID;
import java.util.function.Supplier;

public class LogUtil {
    private static final String REQUEST_ID = "requestId";
    private static final String USER_ID = "userId";
    private static final String ACTION = "action";

    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    public static void setRequestContext() {
        MDC.put(REQUEST_ID, UUID.randomUUID().toString());
    }

    public static void setUserContext(String userId) {
        if (userId != null) {
            MDC.put(USER_ID, userId);
        } else {
            MDC.put(USER_ID, "anonymous");
        }
    }

    public static void setAction(String actionName) {
        if (actionName != null) {
            MDC.put(ACTION, actionName);
        }
    }

    public static void clearContext() {
        MDC.clear();
    }

    public static String getRequestId() {
        return MDC.get(REQUEST_ID);
    }

    public static <T> T withMDC(String userId, String action, Supplier<T> operation) {
        try {
            setRequestContext();
            setUserContext(userId);
            setAction(action);
            return operation.get();
        } finally {
            clearContext();
        }
    }

    public static void logRequest(Logger logger, String method, String path) {
        logger.info("Request received: {} {}", method, path);
    }

    public static void logResponse(Logger logger, String method, String path, int status) {
        logger.info("Response sent: {} {} - Status: {}", method, path, status);
    }

    public static void logError(Logger logger, String message, Throwable error) {
        logger.error("Error occurred: {} - {}", message, error.getMessage(), error);
    }

    public static void logDebug(Logger logger, String message, Object... args) {
        if (logger.isDebugEnabled()) {
            logger.debug(message, args);
        }
    }
}

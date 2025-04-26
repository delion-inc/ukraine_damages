package com.example.ukrdamagereport.entity;

public enum InfrastructureType {
    WAREHOUSE("Warehouse"),
    AIRCRAFT_REPAIR_PLANT("Aircraft repair plant"),
    BRIDGE("Bridge"),
    OIL_DEPOT("Oil depot"),
    GOVERNMENT_FACILITIES("Government facilities"),
    FUEL_DEPOT("Fuel depot"),
    EDUCATION_FACILITY("Education facility (school, etc.)"),
    RELIGIOUS_FACILITIES("Religious facilities"),
    AIRPORT("Airport"),
    HEALTH_FACILITY("Health facility (hospital, health clinic)"),
    INDUSTRIAL_BUSINESS_ENTERPRISE("Industrial/Business/Enterprise facilities"),
    TELECOMMUNICATIONS("Telecommunications"),
    CHEMICAL_STORAGE_UNIT("Chemical storage unit"),
    ELECTRICITY_SUPPLY_SYSTEM("Electricity supply system"),
    NUCLEAR_UNIT("Nuclear unit"),
    CULTURAL_FACILITIES("Cultural facilities (museum, theater etc.)"),
    RAILWAY("Railway"),
    GAS_SUPPLY_SYSTEM("Gas supply system"),
    WATER_SUPPLY_SYSTEM("Water supply system"),
    POWER_PLANT("Power plant"),
    HARBOR("Harbor"),
    ROAD_HIGHWAY("Road / Highway"),
    AGRICULTURAL_FACILITIES("Agricultural facilities"),
    HEATING_AND_WATER_FACILITY("Heating and water facility");

    private final String value;

    InfrastructureType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static InfrastructureType fromString(String text) {
        for (InfrastructureType type : InfrastructureType.values()) {
            if (type.value.equalsIgnoreCase(text)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
} 
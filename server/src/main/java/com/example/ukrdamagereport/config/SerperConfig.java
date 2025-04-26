package com.example.ukrdamagereport.Config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class SerperConfig {
    @Value("${serper.api.key}")
    private String apiKey;

    @Value("${serper.api.url:https://google.serper.dev/images}")
    private String apiUrl;

    @Value("${serper.api.location:Ukraine}")
    private String location;

    @Value("${serper.api.gl:ua}")
    private String gl;

    @Value("${serper.api.hl:uk}")
    private String hl;
}
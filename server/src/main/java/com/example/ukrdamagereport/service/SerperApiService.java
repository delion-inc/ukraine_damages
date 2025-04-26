package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.serper.res.SerperResponse;

public interface SerperApiService {
    /**
     * Performs search using Serper API
     * @param query search query string
     * @return search result with first image
     */
    SerperResponse search(String query);
}
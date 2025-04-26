package com.example.ukrdamagereport.service;


import com.example.ukrdamagereport.dto.serper.res.SerperResponse;

public interface SerperApiService {
    /**
     * Performs search using Serper API
     * @param query search query string
     * @return search results
     */

    SerperResponse search(String query);
}

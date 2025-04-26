package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.serper.res.SerperResponse;

public interface SerperApiService {

    SerperResponse search(String query);
}
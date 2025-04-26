package com.example.ukrdamagereport.repository;

import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    Page<Place> findByOblast(Region oblast, Pageable pageable);
}
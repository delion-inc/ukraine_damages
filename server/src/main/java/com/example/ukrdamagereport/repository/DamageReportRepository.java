package com.example.ukrdamagereport.repository;

import com.example.ukrdamagereport.entity.DamageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DamageReportRepository extends JpaRepository<DamageReport, Long> {
}

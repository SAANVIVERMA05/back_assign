package com.finance.backend.repository;
import com.finance.backend.model.Record;
import com.finance.backend.model.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {
    
    @Query("SELECT r FROM Record r WHERE (:startDate IS NULL OR r.date >= :startDate) AND (:endDate IS NULL OR r.date <= :endDate) AND (:category IS NULL OR r.category = :category) AND (:type IS NULL OR r.type = :type)")
    List<Record> findWithFilters(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("category") String category, @Param("type") RecordType type);
    
    List<Record> findTop5ByOrderByDateDesc();
}

package com.finance.backend.service;

import com.finance.backend.dto.DashboardSummaryDto;
import com.finance.backend.model.Record;
import com.finance.backend.model.RecordType;
import com.finance.backend.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private RecordRepository recordRepository;

    public DashboardSummaryDto getSummary() {
        List<Record> allRecords = recordRepository.findAll();
        
        BigDecimal totalIncome = allRecords.stream()
                .filter(r -> r.getType() == RecordType.INCOME)
                .map(Record::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalExpenses = allRecords.stream()
                .filter(r -> r.getType() == RecordType.EXPENSE)
                .map(Record::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        Map<String, BigDecimal> categoryTotals = allRecords.stream()
                .collect(Collectors.groupingBy(
                        Record::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Record::getAmount, BigDecimal::add)
                ));
                
        List<Record> recent = recordRepository.findTop5ByOrderByDateDesc();

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalIncome(totalIncome);
        dto.setTotalExpenses(totalExpenses);
        dto.setNetBalance(totalIncome.subtract(totalExpenses));
        dto.setCategoryTotals(categoryTotals);
        dto.setRecentTransactions(recent);
        
        return dto;
    }
}

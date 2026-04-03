package com.finance.backend.service;

import com.finance.backend.model.Record;
import com.finance.backend.model.RecordType;
import com.finance.backend.model.User;
import com.finance.backend.repository.RecordRepository;
import com.finance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RecordService {
    
    @Autowired
    private RecordRepository recordRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Record createRecord(Record record, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        record.setCreatedBy(user);
        return recordRepository.save(record);
    }

    public List<Record> getFilteredRecords(LocalDate startDate, LocalDate endDate, String category, RecordType type) {
        return recordRepository.findWithFilters(startDate, endDate, category, type);
    }

    public Record updateRecord(Long id, Record newRecordDetails) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        record.setAmount(newRecordDetails.getAmount());
        record.setType(newRecordDetails.getType());
        record.setCategory(newRecordDetails.getCategory());
        record.setDate(newRecordDetails.getDate());
        record.setDescription(newRecordDetails.getDescription());
        return recordRepository.save(record);
    }

    public void deleteRecord(Long id) {
        recordRepository.deleteById(id);
    }
}

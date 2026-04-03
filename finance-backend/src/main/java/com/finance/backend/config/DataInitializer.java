package com.finance.backend.config;

import com.finance.backend.model.Role;
import com.finance.backend.model.User;
import com.finance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@finance.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User analyst = new User();
            analyst.setName("Data Analyst");
            analyst.setEmail("analyst@finance.com");
            analyst.setPassword(passwordEncoder.encode("analyst123"));
            analyst.setRole(Role.ANALYST);
            userRepository.save(analyst);

            User viewer = new User();
            viewer.setName("Report Viewer");
            viewer.setEmail("viewer@finance.com");
            viewer.setPassword(passwordEncoder.encode("viewer123"));
            viewer.setRole(Role.VIEWER);
            userRepository.save(viewer);
        }
    }
}

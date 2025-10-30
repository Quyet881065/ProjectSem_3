package com.web.shopflower.configuration;

import com.web.shopflower.enums.Role;
import com.web.shopflower.models.RoleEntity;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.RoleRepository;
import com.web.shopflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {
    final PasswordEncoder passwordEncoder;
    @NonFinal
    static final String ADMIN_USER_NAME="admin";
    @NonFinal
    static final String ADMIN_PASSWORD="admin";
    @Bean
    CommandLineRunner initRoles(UserRepository userRepository, RoleRepository roleRepository){
        return args -> {
            // Neu chua co role thif tao
           RoleEntity adminRole = roleRepository.findByCode(Role.ADMIN.name()).orElseGet(()
                        -> roleRepository.save(createRole("Admin", Role.ADMIN.name())));
           RoleEntity userRole = roleRepository.findByCode(Role.USER.name()).orElseGet(()
                        -> roleRepository.save(createRole("User", Role.USER.name())));

           if(userRepository.findByUserName(ADMIN_USER_NAME).isEmpty()){
               UserEntity admin = new UserEntity();
               admin.setUserName(ADMIN_USER_NAME);
               admin.setPassWord(passwordEncoder.encode(ADMIN_PASSWORD));
               admin.setRoles(List.of(adminRole));
               admin.setEmail("admin@gmail.com");
               admin.setFullName("Admin");
               admin.setStatus(1);
               userRepository.save(admin);
               log.info("✅ Default admin account created: username='{}', password='{}'", ADMIN_USER_NAME, ADMIN_PASSWORD);
           }else{
               log.info("ℹ️ Admin user already exists, skipping creation.");
           }
        };
    }
    private RoleEntity createRole(String name, String code){
        RoleEntity role = new RoleEntity();
        role.setCode(code);
        role.setName(name);
        return role;
    }
}

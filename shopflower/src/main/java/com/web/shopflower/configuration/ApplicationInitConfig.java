package com.web.shopflower.configuration;

import com.web.shopflower.enums.Role;
import com.web.shopflower.models.RoleEntity;
import com.web.shopflower.repository.RoleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationInitConfig {
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository){
        return args -> {
            // Neu chua co role thif tao
            roleRepository.findByCode(Role.ADMIN.name()).orElseGet(()
                        -> roleRepository.save(createRole("Admin", Role.ADMIN.name())));
            roleRepository.findByCode(Role.USER.name()).orElseGet(()
                        -> roleRepository.save(createRole("User", Role.USER.name())));
        };
    }
    private RoleEntity createRole(String name, String code){
        RoleEntity role = new RoleEntity();
        role.setCode(code);
        role.setName(name);
        return role;
    }
}

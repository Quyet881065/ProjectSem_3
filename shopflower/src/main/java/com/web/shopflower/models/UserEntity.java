package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class UserEntity {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private String id;

    @Column(name = "username", nullable = false, unique = true)
    private String userName;

    @Column(name = "fullname", nullable = false)
    private String fullName;

    @Column(name = "email" , nullable = false)
    private String email;

    @Column(name = "password" ,nullable = false)
    private String passWord;

    @Column(name = "status", nullable = false)
    private Integer status;

    @ManyToMany(fetch = FetchType.LAZY)
    List<RoleEntity> roles = new ArrayList<>();
}

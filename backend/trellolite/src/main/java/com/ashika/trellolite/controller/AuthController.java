package com.ashika.trellolite.controller;

import com.ashika.trellolite.entity.User;
import com.ashika.trellolite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired private UserRepository userRepo;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return "Login successful! Use Keycloak for authentication.";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, authenticated user!";
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "Hello from protected endpoint!";
    }

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello, anyone can access this!";
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/user/profile")
    public String userProfile() {
        return "Hello, user! This is your profile.";
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome, admin! This is the dashboard.";
    }
}


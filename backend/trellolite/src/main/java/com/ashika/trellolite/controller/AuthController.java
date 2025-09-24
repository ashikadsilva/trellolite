package com.ashika.trellolite.controller;

import com.ashika.trellolite.entity.User;
import com.ashika.trellolite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

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
    public Map<String, Object> hello() {
        return Map.of("message","Hello, authenticated user!");
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "Hello from protected endpoint!";
    }

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello, anyone can access this!";
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/admin/dashboard")
    public Map<String, Object> getAdminDashboard(JwtAuthenticationToken jwtAuth) {
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("username", jwtAuth.getToken().getClaim("preferred_username"));
        dashboard.put("message", "Welcome to the admin dashboard!");
        return dashboard;
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/user/profile")
    public Map<String, Object> getUserProfile(JwtAuthenticationToken auth) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("username", auth.getToken().getClaim("preferred_username"));
        profile.put("lastName", auth.getToken().getClaim("family_name"));
        profile.put("email", auth.getToken().getClaim("email"));
        return profile;
    }

    @PutMapping("/user/profile")
    @PreAuthorize("hasRole('admin') or hasRole('user')")
        public Map<String, Object> updateUserProfile(@RequestBody Map<String, Object> updates, JwtAuthenticationToken jwtAuth) {

        String email = jwtAuth.getToken().getClaim("email");
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        Update allowed fields
        if (updates.containsKey("firstName")) {
            user.setName((String) updates.get("firstName"));
        } if (updates.containsKey("lastName")){
            user.setName((String) updates.get("lastName"));
        }

        userRepo.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("name", user.getName() + " " + user.getLastName());
        response.put("email", user.getEmail());
        return response;
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/user/profile-info")
    public Map<String, Object> getUserProfileInfo(JwtAuthenticationToken auth) {
        String email = auth.getToken().getClaim("email");
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("name", user.getName());
        profile.put("name", user.getName() + " " + user.getLastName());
        profile.put("email", user.getEmail());
        profile.put("message", "Welcome to your profile!");
        return profile;
    }
}


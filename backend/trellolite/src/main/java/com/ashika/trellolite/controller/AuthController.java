package com.ashika.trellolite.controller;

import com.ashika.trellolite.entity.User;
import com.ashika.trellolite.models.UserVo;
import com.ashika.trellolite.repository.UserRepository;
import com.ashika.trellolite.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class    AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/register")
    public UserVo register(@RequestBody @Valid UserVo user, @RequestParam String rawPassword) {
        return userService.registerUser(user, rawPassword);
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

    @PreAuthorize(" hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public Map<String, Object> getAdminDashboard(JwtAuthenticationToken jwtAuth) {
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("username", jwtAuth.getToken().getClaim("preferred_username"));
        dashboard.put("message", "Welcome to the admin dashboard!");
        return dashboard;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/profile")
    public Map<String, Object> getUserProfile(JwtAuthenticationToken auth) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("username", auth.getToken().getClaim("preferred_username"));
        profile.put("lastName", auth.getToken().getClaim("family_name"));
        profile.put("email", auth.getToken().getClaim("email"));
        return profile;
    }

    @PutMapping("/user/profile")
    @PreAuthorize("hasRole('ADMIN')")
        public UserVo updateUserProfile(@RequestBody UserVo updates, JwtAuthenticationToken jwtAuth) {

        String email = jwtAuth.getToken().getClaim("email");
        return userService.updateUserProfile(email, updates);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/profile-info")
    public UserVo getUserProfileInfo(JwtAuthenticationToken auth) {
        String email = auth.getToken().getClaim("email");
        return userService.getUserByEmail(email);
    }
}


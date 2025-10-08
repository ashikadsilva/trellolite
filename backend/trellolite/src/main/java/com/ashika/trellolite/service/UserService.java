package com.ashika.trellolite.service;

import com.ashika.trellolite.entity.User;
import com.ashika.trellolite.models.UserVo;
import com.ashika.trellolite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Fetch user by email
    public UserVo getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    // Update user profile
    public UserVo updateUserProfile(String email, UserVo updates) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.getFirstName() != null) user.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) user.setLastName(updates.getLastName());
        if (updates.getFullName() != null) user.setFullName(updates.getFullName());

        userRepository.save(user);
        return mapToDto(user);
    }

    // Register new user
    public UserVo registerUser(UserVo userVo, String rawPassword) {
        if (userRepository.findByEmail(userVo.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .firstName(userVo.getFirstName())
                .lastName(userVo.getLastName())
                .fullName(userVo.getFullName())
                .email(userVo.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .build();

        userRepository.save(user);
        return mapToDto(user);
    }

    // Map entity -> DTO
    private UserVo mapToDto(User user) {
        return UserVo.builder()
                .userId(String.valueOf(user.getId()))
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}

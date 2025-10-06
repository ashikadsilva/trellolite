package com.ashika.trellolite.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVo {
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String profilePicture;
}
package com.ashika.trellolite.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class JwtRoleConverter {

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter((Jwt jwt) -> {
            Object rolesObj = jwt.getClaim("realm_access") != null
                    ? ((java.util.Map<String, Object>) jwt.getClaim("realm_access")).get("roles")
                    : null;

            if (rolesObj instanceof List) {
                List<String> roles = (List<String>) rolesObj;
                return roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
            }
            return List.of();
        });

        return jwtConverter;
    }
}

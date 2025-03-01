package com.pbl5.pbl5.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    private final Dotenv dotenv;

    public EnvConfig() {
        dotenv = Dotenv.load(); // Load file .env
    }

    public String get(String key) {
        return dotenv.get(key);
    }

    @Bean
    public Dotenv dotenv() {
        return dotenv;
    }
}
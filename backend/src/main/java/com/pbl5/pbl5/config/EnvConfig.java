// package com.pbl5.pbl5.config;

// import io.github.cdimascio.dotenv.Dotenv;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class EnvConfig {

//     @Bean
//     public Dotenv dotenv() {
//         Dotenv dotenv = Dotenv.load();

//         // Đẩy biến vào System properties cho Spring Boot lấy được
//         System.setProperty("DB_URL", dotenv.get("DB_URL"));
//         System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
//         System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

//         return dotenv;
//     }
// }
package com.pbl5.pbl5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.pbl5.pbl5.modal")
public class Pbl5Application {

    public static void main(String[] args) {
        SpringApplication.run(Pbl5Application.class, args);
    }

}

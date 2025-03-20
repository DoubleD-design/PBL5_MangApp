package com.pbl5.pbl5;

import com.pbl5.pbl5.config.DotenvApplicationListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.pbl5.pbl5.modal")
public class Pbl5Application {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Pbl5Application.class);

        // Đăng ký listener này ngay từ đầu!
        app.addListeners(new DotenvApplicationListener());

        app.run(args);
    }
}

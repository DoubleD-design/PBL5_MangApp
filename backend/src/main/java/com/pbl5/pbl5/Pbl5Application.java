package com.pbl5.pbl5;

//import com.pbl5.pbl5.config.DotenvApplicationListener;

//import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EntityScan(basePackages = "com.pbl5.pbl5.modal")
@EnableCaching
public class Pbl5Application {

    public static void main(String[] args) {
        //Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        SpringApplication app = new SpringApplication(Pbl5Application.class);
        
        // Đăng ký listener này ngay từ đầu!
        //app.addListeners(new DotenvApplicationListener());

        app.run(args);
    }
}

package com.pbl5.pbl5.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class DotenvApplicationListener implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("CONNECTION_STRING", dotenv.get("CONNECTION_STRING"));
        System.setProperty("AZURE_SAS_TOKEN", dotenv.get("AZURE_SAS_TOKEN"));
        System.setProperty("CLIENT_ID", dotenv.get("CLIENT_ID"));
        System.setProperty("CLIENT_SECRET", dotenv.get("CLIENT_SECRET"));
        System.out.println("Loaded Dotenv properties to System!");
    }
}
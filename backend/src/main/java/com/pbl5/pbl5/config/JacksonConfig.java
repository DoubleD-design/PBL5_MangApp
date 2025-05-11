package com.pbl5.pbl5.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;


@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate5JakartaModule hibernate5Module() {
        Hibernate5JakartaModule module = new Hibernate5JakartaModule();
        
        // Configure module to handle lazy loading properly
        // Don't force lazy loading globally as it can cause performance issues
        module.configure(Hibernate5JakartaModule.Feature.FORCE_LAZY_LOADING, false);
        
        // Serialize entity identifier for uninitialized proxies
        module.configure(Hibernate5JakartaModule.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS, true);
        
        // Don't fail on empty beans
        module.configure(Hibernate5JakartaModule.Feature.USE_TRANSIENT_ANNOTATION, false);
        
        // Ignore lazy loading exceptions during serialization
        module.configure(Hibernate5JakartaModule.Feature.REPLACE_PERSISTENT_COLLECTIONS, true);
        
        return module;
    }
    
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // Register Hibernate5 module
        objectMapper.registerModule(hibernate5Module());
        
        // Register JavaTimeModule for proper date/time handling
        objectMapper.registerModule(new JavaTimeModule());
        
        // Disable writing dates as timestamps
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Don't fail on empty beans
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        
        return objectMapper;
    }
}
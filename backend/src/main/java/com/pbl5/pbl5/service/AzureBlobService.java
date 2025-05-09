package com.pbl5.pbl5.service;

import com.azure.storage.blob.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class AzureBlobService {

    private final String connectionString = System.getProperty("CONNECTION_STRING");
    private final String containerName = "manga";

    @Value("${spring.cloud.azure.storage.blob.endpoint}")
    private String blobEndpoint;

    public String uploadImage(MultipartFile file) {
        try {
            // Tạo client cho blob container
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);

            // Đặt tên file duy nhất trong thư mục con "coverimage"
            String fileName = "coverimage/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Upload file
            BlobClient blobClient = containerClient.getBlobClient(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                blobClient.upload(inputStream, file.getSize(), true);
            }

            // Trả về URL của ảnh
            return blobEndpoint + "/" + containerName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to Azure Blob Storage: " + e.getMessage(), e);
        }
    }
}

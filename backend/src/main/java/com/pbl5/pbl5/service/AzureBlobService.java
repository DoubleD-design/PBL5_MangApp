package com.pbl5.pbl5.service;

import com.azure.storage.blob.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Service
public class AzureBlobService {

    private final String connectionString = System.getProperty("CONNECTION_STRING");
    private final String containerNameManga = "manga";
    private final String containerNameUser = "user";
    @Value("${spring.cloud.azure.storage.blob.endpoint}")
    private String blobEndpoint;

    public String uploadCoverImage(MultipartFile file) {
        try {
            // Tạo client cho blob container
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerNameManga);

            // Đặt tên file duy nhất trong thư mục con "coverimage"
            String fileName = "coverimage/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Upload file
            BlobClient blobClient = containerClient.getBlobClient(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                blobClient.upload(inputStream, file.getSize(), true);
            }

            // Trả về URL của ảnh
            return blobEndpoint + "/" + containerNameManga + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to Azure Blob Storage: " + e.getMessage(), e);
        }
    }

    /**
     * Upload multiple images (pages) to Azure Blob Storage and return their URLs.
     * @param files array of MultipartFile (pages)
     * @return List of URLs for uploaded images
     */
    public List<String> uploadChapterPages(MultipartFile[] files) {
        List<String> urls = new ArrayList<>();
        try {
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerNameManga);

            for (MultipartFile file : files) {
                String fileName = "chapterpages/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
                BlobClient blobClient = containerClient.getBlobClient(fileName);
                try (InputStream inputStream = file.getInputStream()) {
                    blobClient.upload(inputStream, file.getSize(), true);
                }
                urls.add(blobEndpoint + "/" + containerNameManga + "/" + fileName);
            }
            return urls;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload chapter pages to Azure Blob Storage: " + e.getMessage(), e);
        }
    }
}

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

    public String uploadCoverImage(String mangaId, MultipartFile file) {
        try {
            // Tạo client cho blob container
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerNameManga);

            // Đặt tên file là coverimage/{mangaId}.jpg
            String fileName = String.format("coverimage/%s.jpg", mangaId);

            // Upload file
            BlobClient blobClient = containerClient.getBlobClient(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                blobClient.upload(inputStream, file.getSize(), true);
            }

            // Trả về URL của ảnh
            return blobEndpoint + "/" + containerNameManga + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload cover image to Azure Blob Storage: " + e.getMessage(), e);
        }
    }

    public List<String> uploadChapterPages(String mangaId, String chapterId, MultipartFile[] files) {
        List<String> urls = new ArrayList<>();
        try {
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerNameManga);

            int pageIndex = 1;
            for (MultipartFile file : files) {
                // Reset file name to sequential order (e.g., 001.jpg, 002.jpg)
                String fileName = String.format("%s/%s/%03d.jpg", mangaId, chapterId, pageIndex++);
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

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}

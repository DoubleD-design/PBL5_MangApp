package com.pbl5.pbl5.request;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {
    @NotBlank(message = "Old password cannot be blank")
    private String oldPassword;

    @NotBlank(message = "New password cannot be blank")
    private String password; // Change from newPassword to password

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getPassword() { // Change from getNewPassword to getPassword
        return password;
    }

    public void setPassword(String password) { // Change from setNewPassword to setPassword
        this.password = password;
    }
}

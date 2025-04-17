import React, { useState } from 'react';
import authService from "../services/authService"; // Import authService
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        birthday: '',
        gender: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await authService.register({
            ...formData,
            birthday: formData.birthday,
            gender: formData.gender,
          });
          if (response.success) {
            console.log("Registration successful");
            navigate("/login"); // Chuyển hướng về trang đăng nhập
          }
        } catch (error) {
          console.error('Registration failed:', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Registration failed. Please try again.');
        }
      };
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#121212', // Black background
        },
        formBox: {
            background: '#1e1e1e', // Dark gray background
            padding: '20px 30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
        },
        heading: {
            marginBottom: '20px',
            color: 'rgb(237, 113, 76)', // Updated orange color
        },
        formGroup: {
            marginBottom: '15px',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#fff', // White text
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid rgb(237, 113, 76)', // Updated orange border
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: '#2c2c2c', // Darker gray input background
            color: '#fff', // White text
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgb(237, 113, 76)', // Updated orange button
            color: '#121212', // Black text
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        buttonHover: {
            backgroundColor: 'rgb(200, 95, 64)', // Darker orange on hover
        },
        links: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
        },
        link: {
            textDecoration: 'underline',
            color: 'rgb(237, 113, 76)', // Updated orange links
            fontSize: '14px',
        },
        linkHover: {
            color: 'rgb(200, 95, 64)', // Darker orange on hover
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.formBox}>
                <h2 style={styles.heading}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="birthday" style={styles.label}>Birthday</label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="gender" style={styles.label}>Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email or Phone Number</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Register
                    </button>
                </form>
                <div style={styles.links}>
                    <a
                        href="/"
                        style={styles.link}
                        onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                        onMouseOut={(e) => (e.target.style.color = styles.link.color)}
                    >
                        Back
                    </a>
                    <a
                        href="/login"
                        style={styles.link}
                        onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                        onMouseOut={(e) => (e.target.style.color = styles.link.color)}
                    >
                        I have an account.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;

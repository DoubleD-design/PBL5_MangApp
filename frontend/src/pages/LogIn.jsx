import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import authService from "../services/authService"; // Import authService

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Can be username, phone number, or email
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!formData.identifier || !formData.password) {
  //     console.error('Both identifier and password are required.');
  //     return;
  //   }
  //   console.log('Form submitted:', formData);
  //   // Add login logic here, e.g., API call
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Kiểm tra xem hàm có được gọi không
    if (!formData.username || !formData.password) {
      console.error("Both username and password are required.");
      return;
    }

    try {
      // Gửi yêu cầu đăng nhập
      console.log("Sending login request...");
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });
      console.log("Login response:", response);

      // Nếu đăng nhập thành công, chuyển hướng
      if (authService.isAuthenticated()) {
        console.log("Login successful:", response);
        navigate("/"); // Chuyển hướng về trang chính
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid usernamee or password.");
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
    socialButtons: {
      marginTop: '20px',
    },
    socialButton: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#3b5998', // Default blue for Facebook
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
    },
    googleButton: {
      backgroundColor: '#db4437', // Google red
    },
    emailButton: {
      backgroundColor: '#1e88e5', // Email blue
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username, Phone Number, or Email
            </label>
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
            <label htmlFor="password" style={styles.label}>Password</label>
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
            Log In
          </button>
        </form>
        <div style={styles.links}>
          <Link
            to="/"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Back
          </Link>
          <Link
            to="/register"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            I don't have an account.
          </Link>
        </div>
        <div style={styles.socialButtons}>
          <button
            style={{ ...styles.socialButton, ...styles.googleButton }}
          >
            Login with Google
          </button>
          <button
            style={styles.socialButton}
          >
            Login with Facebook
          </button>
          <button
            style={{ ...styles.socialButton, ...styles.emailButton }}
          >
            Login with Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;

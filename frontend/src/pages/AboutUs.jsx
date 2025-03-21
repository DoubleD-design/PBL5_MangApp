import React from 'react';
import { useState } from "react";
const AboutUs = () => {
    return (
        <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif', 
            textAlign: 'center', 
            maxWidth: '800px', 
            margin: '0 auto' 
        }}>
            <h1 style={{ color: '#333', marginBottom: '20px' }}>About Us</h1>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
                Welcome to our page! This is a placeholder for information about the owner of this page.
            </p>
            <h2 style={{ color: '#444', marginTop: '30px' }}>Our Mission</h2>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
                To provide the best services and create a meaningful impact in our community.
            </p>
            <h2 style={{ color: '#444', marginTop: '30px' }}>Contact Us</h2>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
                Email: owner@example.com<br />
                Phone: +123 456 7890
            </p>
        </div>
    );
};

export default AboutUs;

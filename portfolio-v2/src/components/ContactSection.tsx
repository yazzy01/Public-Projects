import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #e6e6e6;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    
    i {
      font-size: 1.2rem;
      color: #00ff9d;
      margin-right: 1rem;
      width: 24px;
      text-align: center;
    }
    
    p {
      color: #ccc;
      font-size: 1rem;
    }
  }
  
  .social-links {
    margin-top: 3rem;
    
    h4 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #e6e6e6;
    }
    
    .social-icons {
      display: flex;
      gap: 1rem;
      
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #112240;
        color: #00ff9d;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 255, 157, 0.2);
        
        &:hover {
          background: linear-gradient(135deg, #4a90e2, #00ff9d);
          color: #0a192f;
          transform: translateY(-3px);
        }
      }
    }
  }
`;

const ContactForm = styled(motion.form)`
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #e6e6e6;
  }
  
  input, textarea {
    width: 100%;
    padding: 1rem;
    background: #112240;
    border: 1px solid rgba(74, 144, 226, 0.1);
    border-radius: 4px;
    color: #e6e6e6;
    font-family: inherit;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: rgba(0, 255, 157, 0.5);
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.1);
    }
  }
  
  textarea {
    min-height: 150px;
    resize: vertical;
  }
  
  button {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #4a90e2, #00ff9d);
    color: #0a192f;
    border: none;
    border-radius: 30px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 255, 157, 0.2);
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 1.5rem;
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 4px;
  margin-bottom: 1.5rem;
  
  p {
    color: #00ff9d;
    margin: 0;
  }
`;

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // For this example, we'll just show a success message
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    
    // Reset form status after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  
  return (
    <ContactContainer>
      <ContactInfo
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3>Get in Touch</h3>
        
        <div className="info-item">
          <i className="fas fa-map-marker-alt"></i>
          <p>AGADIR 80070, Morocco</p>
        </div>
        
        <div className="info-item">
          <i className="fas fa-phone"></i>
          <p>+212 634-814854</p>
        </div>
        
        <div className="info-item">
          <i className="fas fa-envelope"></i>
          <p>rziguiyassir@gmail.com</p>
        </div>
        
        <div className="social-links">
          <h4>Connect With Me</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </ContactInfo>
      
      <ContactForm
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
      >
        {formSubmitted && (
          <SuccessMessage
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p>Thank you for your message! I'll get back to you soon.</p>
          </SuccessMessage>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Send Message</button>
      </ContactForm>
    </ContactContainer>
  );
};

export default ContactSection; 
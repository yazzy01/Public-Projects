import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import ExperienceCarousel from './components/ExperienceCarousel';
import CertificationsCarousel from './components/CertificationsCarousel';
import SkillsGrid from './components/SkillsGrid';
import ContactSection from './components/ContactSection';
import experienceData from './data/experienceData';
import certificationsData from './data/certificationsData';
import skillsData from './data/skillsData';
import { handleNavClick } from './utils/smoothScroll';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a192f;
  color: #fff;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background-color: rgba(10, 25, 47, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(74, 144, 226, 0.1);
  
  &.scroll-down {
    transform: translateY(-100%);
  }
  
  &.scroll-up {
    transform: translateY(0);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.4);
  }
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ff9d;
  text-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  a {
    text-decoration: none;
    color: #e6e6e6;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 0;
      background-color: #00ff9d;
      transition: width 0.3s ease;
    }
    
    &:hover::after, &.active::after {
      width: 100%;
    }
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding-top: 80px;
`;

const Section = styled.section`
  padding: 6rem 0;
  position: relative;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #00ff9d;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #4a90e2, #00ff9d);
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const HeroSection = styled(Section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
  padding: 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  position: relative;
  z-index: 1;
  padding: 0 2rem;
  
  h1 {
    font-size: clamp(2.5rem, 8vw, 4rem);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #4a90e2, #00ff9d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
  }
  
  h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 2rem;
    font-weight: 400;
    color: #e6e6e6;
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #aaa;
    margin-bottom: 2.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.a`
  padding: 1rem 2.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-block;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &.primary {
    background: linear-gradient(135deg, #4a90e2, #00ff9d);
    color: #0a192f;
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    border: 2px solid #00ff9d;
    color: #00ff9d;
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 157, 0.2);
    }
  }
`;

const AboutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #ccc;
    margin-bottom: 1.5rem;
  }
`;

const Footer = styled.footer`
  background-color: #112240;
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid rgba(74, 144, 226, 0.1);
  
  p {
    color: #aaa;
    font-size: 0.9rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #e6e6e6;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: #112240;
  z-index: 2000;
  padding: 2rem;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #e6e6e6;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  ul {
    list-style: none;
    margin-top: 3rem;
    
    li {
      margin-bottom: 1.5rem;
      
      a {
        text-decoration: none;
        color: #e6e6e6;
        font-size: 1.2rem;
        transition: color 0.3s ease;
        
        &:hover {
          color: #00ff9d;
        }
      }
    }
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [headerClass, setHeaderClass] = useState('');
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 0) {
        setHeaderClass('');
      } else if (currentScrollY > lastScrollY) {
        setHeaderClass('scroll-down');
      } else {
        setHeaderClass('scroll-up');
      }
      
      lastScrollY = currentScrollY;
      
      // Detect active section
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.getAttribute('id');
        
        if (sectionTop <= 100 && sectionTop >= -300 && sectionId) {
          setActiveSection(sectionId);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header className={headerClass}>
          <Navigation>
            <Logo>YR</Logo>
            <NavLinks>
              <li>
                <a 
                  href="#home" 
                  onClick={handleNavClick}
                  className={activeSection === 'home' ? 'active' : ''}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={handleNavClick}
                  className={activeSection === 'about' ? 'active' : ''}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#experience" 
                  onClick={handleNavClick}
                  className={activeSection === 'experience' ? 'active' : ''}
                >
                  Experience
                </a>
              </li>
              <li>
                <a 
                  href="#skills" 
                  onClick={handleNavClick}
                  className={activeSection === 'skills' ? 'active' : ''}
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#certifications" 
                  onClick={handleNavClick}
                  className={activeSection === 'certifications' ? 'active' : ''}
                >
                  Certifications
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={handleNavClick}
                  className={activeSection === 'contact' ? 'active' : ''}
                >
                  Contact
                </a>
              </li>
            </NavLinks>
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <i className="fas fa-bars"></i>
            </MobileMenuButton>
          </Navigation>
        </Header>
        
        <Overlay isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
        
        <MobileMenu isOpen={mobileMenuOpen}>
          <button className="close-button" onClick={closeMobileMenu}>
            <i className="fas fa-times"></i>
          </button>
          <ul>
            <li>
              <a href="#home" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                About
              </a>
            </li>
            <li>
              <a href="#experience" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                Experience
              </a>
            </li>
            <li>
              <a href="#skills" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                Skills
              </a>
            </li>
            <li>
              <a href="#certifications" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                Certifications
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { handleNavClick(e); closeMobileMenu(); }}>
                Contact
              </a>
            </li>
          </ul>
        </MobileMenu>
        
        <HeroSection id="home">
          <HeroContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Yassir Rzigui</h1>
            <h2>Technical Quality Assurance & AI Development Specialist</h2>
            <p>
              Certified Backend Developer and Quality Assurance specialist with extensive 
              experience in AI data operations and quality control systems.
            </p>
            <ButtonGroup>
              <Button 
                href="#contact" 
                className="primary"
                onClick={handleNavClick}
              >
                Contact Me
              </Button>
              <Button 
                href="#experience" 
                className="secondary"
                onClick={handleNavClick}
              >
                View Experience
              </Button>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>
        
        <MainContent>
          <Section id="about">
            <SectionHeading>About Me</SectionHeading>
            <AboutContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p>
                  I am a multilingual professional proficient in diverse Arabic dialects, French, and English, 
                  specializing in cross-cultural technical communication and quality assurance. My expertise 
                  spans across AI data annotation, transcription, and quality validation across multiple platforms.
                </p>
                <p>
                  With a strong background in quality management systems and AI development, I excel at 
                  implementing rigorous quality standards and processes. My technical skills in backend 
                  development complement my quality assurance expertise, allowing me to bridge the gap between 
                  development and quality control.
                </p>
                <p>
                  I'm passionate about ensuring the highest level of quality in AI systems and leveraging 
                  technology to create impactful solutions. My goal is to contribute to the advancement of 
                  AI technologies while maintaining strict quality standards and ethical considerations.
                </p>
              </motion.div>
            </AboutContainer>
          </Section>
          
          <Section id="experience">
            <SectionHeading>Professional Experience</SectionHeading>
            <ExperienceCarousel experiences={experienceData} />
          </Section>
          
          <Section id="skills">
            <SectionHeading>Technical Skills</SectionHeading>
            <SkillsGrid skills={skillsData} />
          </Section>
          
          <Section id="certifications">
            <SectionHeading>Certifications</SectionHeading>
            <CertificationsCarousel certifications={certificationsData} />
          </Section>
          
          <Section id="contact">
            <SectionHeading>Contact Me</SectionHeading>
            <ContactSection />
          </Section>
        </MainContent>
        
        <Footer>
          <p>&copy; {new Date().getFullYear()} Yassir Rzigui. All rights reserved.</p>
        </Footer>
      </AppContainer>
    </>
  );
};

export default App; 
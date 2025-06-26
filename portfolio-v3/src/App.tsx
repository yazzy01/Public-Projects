import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CircularBackground from './components/CircularBackground';
import CircularNav from './components/CircularNav';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  max-width: 800px;

  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffd700, #00ffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #888;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #aaa;
    margin-bottom: 2rem;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <CircularBackground />
        <CircularNav />
        <MainContent>
          <HeroSection id="home">
            <HeroContent
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Yassir Rzigui</h1>
              <h2>AI Development Specialist</h2>
              <p>
                Passionate about creating intelligent solutions and pushing the boundaries
                of what's possible with artificial intelligence. Specializing in machine
                learning, deep learning, and quality assurance to build robust and
                innovative applications.
              </p>
            </HeroContent>
          </HeroSection>
          <About />
          <Experience />
          <Certifications />
          <Contact />
        </MainContent>
        <Footer />
      </AppContainer>
    </>
  );
};

export default App; 
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  min-height: 100vh;
  padding: 4rem 0;
  display: flex;
  align-items: center;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutText = styled(motion.div)`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #ffd700, #00ffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #aaa;
    margin-bottom: 1.5rem;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      color: #aaa;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;

      &:before {
        content: '▹';
        color: #00ffff;
        margin-right: 0.5rem;
      }
    }
  }
`;

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AboutSection id="about">
      <AboutContent>
        <AboutText
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>About Me</motion.h2>
          <motion.p variants={itemVariants}>
            As an AI Development Specialist, I bring together my passion for artificial
            intelligence and my expertise in quality assurance to create robust and
            innovative solutions. With a strong foundation in machine learning and deep
            learning, I specialize in developing intelligent systems that solve real-world
            problems.
          </motion.p>
          <motion.p variants={itemVariants}>
            My journey in tech has led me to work on diverse projects, from implementing
            complex ML models to ensuring the highest standards of quality in AI
            applications. I'm particularly interested in the intersection of AI and
            quality assurance, where I've developed methodologies to validate and
            optimize AI systems.
          </motion.p>
        </AboutText>

        <SkillsGrid
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <SkillCard variants={itemVariants}>
            <h3>AI & Machine Learning</h3>
            <ul>
              <li>Deep Learning</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision</li>
              <li>TensorFlow & PyTorch</li>
              <li>Neural Networks</li>
            </ul>
          </SkillCard>

          <SkillCard variants={itemVariants}>
            <h3>Quality Assurance</h3>
            <ul>
              <li>Test Automation</li>
              <li>Performance Testing</li>
              <li>CI/CD Integration</li>
              <li>Quality Metrics</li>
              <li>Test Strategy Development</li>
            </ul>
          </SkillCard>

          <SkillCard variants={itemVariants}>
            <h3>Development</h3>
            <ul>
              <li>Python</li>
              <li>JavaScript/TypeScript</li>
              <li>React & Node.js</li>
              <li>RESTful APIs</li>
              <li>Git & Version Control</li>
            </ul>
          </SkillCard>

          <SkillCard variants={itemVariants}>
            <h3>Tools & Frameworks</h3>
            <ul>
              <li>Docker & Kubernetes</li>
              <li>AWS & Cloud Services</li>
              <li>Selenium & Cypress</li>
              <li>Jenkins & GitLab CI</li>
              <li>Jira & Confluence</li>
            </ul>
          </SkillCard>
        </SkillsGrid>
      </AboutContent>
    </AboutSection>
  );
};

export default About; 
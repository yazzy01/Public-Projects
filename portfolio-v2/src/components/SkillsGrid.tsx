import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const SkillCategory = styled(motion.div)`
  background: #112240;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 255, 157, 0.1);
    border-color: rgba(0, 255, 157, 0.2);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #e6e6e6;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 30px;
      height: 3px;
      background: linear-gradient(135deg, #4a90e2, #00ff9d);
      left: 0;
      bottom: -8px;
      border-radius: 3px;
    }
  }

  ul {
    padding-left: 1.2rem;
    
    li {
      margin-bottom: 0.8rem;
      color: #ccc;
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4a90e2;
        left: -1rem;
        top: 0.5rem;
      }
    }
  }
`;

interface Skill {
  name: string;
  items: string[];
}

interface SkillsGridProps {
  skills: Skill[];
}

const SkillsGrid: React.FC<SkillsGridProps> = ({ skills }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <SkillsContainer
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {skills.map((skill, index) => (
        <SkillCategory 
          key={index}
          variants={itemVariants}
        >
          <h3>{skill.name}</h3>
          <ul>
            {skill.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </SkillCategory>
      ))}
    </SkillsContainer>
  );
};

export default SkillsGrid; 
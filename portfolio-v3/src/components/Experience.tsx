import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceSection = styled.section`
  min-height: 100vh;
  padding: 4rem 0;
  display: flex;
  align-items: center;
`;

const ExperienceContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #ffd700, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ExperienceContainer = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabList = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: row;
    overflow-x: auto;
    border-left: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  color: ${props => props.isActive ? '#ffd700' : '#aaa'};
  text-align: left;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: #ffd700;
  }

  &::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    height: 100%;
    width: 2px;
    background: ${props => props.isActive ? '#ffd700' : 'transparent'};
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    white-space: nowrap;

    &::before {
      left: 0;
      bottom: -1rem;
      top: auto;
      width: 100%;
      height: 2px;
    }
  }
`;

const TabContent = styled(motion.div)`
  flex: 1;
  padding: 0 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const Company = styled.h4`
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 1rem;
`;

const Duration = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1.5rem;
`;

const Responsibilities = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    color: #aaa;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;

    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: #00ffff;
    }
  }
`;

interface Job {
  id: string;
  company: string;
  title: string;
  duration: string;
  responsibilities: string[];
}

const jobs: Job[] = [
  {
    id: 'digital-maroc',
    company: 'Digital Maroc School',
    title: 'AI Development Specialist',
    duration: 'January 2023 - Present',
    responsibilities: [
      'Lead the development and implementation of AI-powered solutions for educational technology applications.',
      'Design and optimize machine learning models for improved learning outcomes and student engagement.',
      'Collaborate with cross-functional teams to integrate AI features into existing educational platforms.',
      'Implement quality assurance processes for AI systems, ensuring reliability and accuracy.',
      'Mentor junior developers and provide technical guidance on AI implementation best practices.',
    ],
  },
  {
    id: 'freelance',
    company: 'Freelance',
    title: 'AI & QA Consultant',
    duration: 'June 2021 - December 2022',
    responsibilities: [
      'Provided consulting services for AI implementation and quality assurance to various clients.',
      'Developed custom machine learning solutions for business process automation.',
      'Created and executed comprehensive test strategies for AI-powered applications.',
      'Optimized existing AI models for improved performance and accuracy.',
      'Conducted technical reviews and provided recommendations for AI system architecture.',
    ],
  },
  // Add more jobs as needed
];

const Experience: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState(jobs[0].id);

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
    <ExperienceSection id="experience">
      <ExperienceContent>
        <SectionTitle
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          Where I've Worked
        </SectionTitle>

        <ExperienceContainer>
          <TabList>
            {jobs.map(job => (
              <TabButton
                key={job.id}
                isActive={selectedJob === job.id}
                onClick={() => setSelectedJob(job.id)}
              >
                {job.company}
              </TabButton>
            ))}
          </TabList>

          <AnimatePresence mode="wait">
            {jobs.map(job => {
              if (job.id !== selectedJob) return null;
              return (
                <TabContent
                  key={job.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <JobTitle>{job.title}</JobTitle>
                  <Company>{job.company}</Company>
                  <Duration>{job.duration}</Duration>
                  <Responsibilities>
                    {job.responsibilities.map((responsibility, index) => (
                      <motion.li
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                      >
                        {responsibility}
                      </motion.li>
                    ))}
                  </Responsibilities>
                </TabContent>
              );
            })}
          </AnimatePresence>
        </ExperienceContainer>
      </ExperienceContent>
    </ExperienceSection>
  );
};

export default Experience; 
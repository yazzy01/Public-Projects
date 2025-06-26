import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CertificationsSection = styled.section`
  min-height: 100vh;
  padding: 4rem 0;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #ffd700, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const CertificationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const CertificationTitle = styled.h3`
  font-size: 1.4rem;
  color: #ffd700;
  margin-bottom: 1rem;
`;

const CertificationIssuer = styled.h4`
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 1rem;
`;

const CertificationDate = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
`;

const CertificationDescription = styled.p`
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CertificationSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
`;

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
}

const certifications: Certification[] = [
  {
    id: 'digital-ai-architect',
    title: 'Digital AI Architect: Mastering Web Development and Intelligent Systems',
    issuer: 'Digital Maroc School',
    date: '2023',
    description: 'Comprehensive certification in AI development, web technologies, and system architecture, focusing on building intelligent and scalable applications.',
    skills: ['AI Development', 'Web Development', 'System Architecture', 'Machine Learning'],
  },
  {
    id: 'ai-specialist',
    title: 'AI Development Specialist',
    issuer: 'Tech Institute',
    date: '2022',
    description: 'Advanced certification in artificial intelligence development, covering machine learning, deep learning, and neural networks.',
    skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Python'],
  },
  {
    id: 'qa-expert',
    title: 'Quality Assurance Expert',
    issuer: 'Quality Tech Academy',
    date: '2021',
    description: 'Professional certification in quality assurance methodologies, test automation, and quality control processes.',
    skills: ['Test Automation', 'Quality Control', 'CI/CD', 'Testing Frameworks'],
  },
  // Add more certifications as needed
];

const Certifications: React.FC = () => {
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
    <CertificationsSection id="certifications">
      <SectionTitle
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        Certifications
      </SectionTitle>

      <CertificationsGrid>
        {certifications.map((cert) => (
          <CertificationCard
            key={cert.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <CertificationTitle>{cert.title}</CertificationTitle>
            <CertificationIssuer>{cert.issuer}</CertificationIssuer>
            <CertificationDate>{cert.date}</CertificationDate>
            <CertificationDescription>{cert.description}</CertificationDescription>
            <CertificationSkills>
              {cert.skills.map((skill, index) => (
                <SkillTag key={index}>{skill}</SkillTag>
              ))}
            </CertificationSkills>
          </CertificationCard>
        ))}
      </CertificationsGrid>
    </CertificationsSection>
  );
};

export default Certifications; 
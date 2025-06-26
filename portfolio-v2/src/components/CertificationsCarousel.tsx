import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 2rem 0;
`;

const CarouselTrack = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
`;

const CardWrapper = styled(motion.div)`
  width: 100%;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: #112240;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(74, 144, 226, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 255, 157, 0.1);
    border-color: rgba(0, 255, 157, 0.2);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #e6e6e6;
  }

  .issuer {
    font-weight: 500;
    color: #4a90e2;
    margin-bottom: 0.5rem;
  }

  .date {
    font-size: 0.9rem;
    color: #aaa;
    margin-bottom: 1.5rem;
  }

  ul {
    padding-left: 1.2rem;
    
    li {
      margin-bottom: 0.5rem;
      color: #ccc;
    }
  }
`;

const NavButton = styled.button`
  background: rgba(17, 34, 64, 0.8);
  color: #00ff9d;
  border: 1px solid rgba(0, 255, 157, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #4a90e2, #00ff9d);
    color: #0a192f;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.prev {
    left: 1rem;
  }

  &.next {
    right: 1rem;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #4a90e2, #00ff9d)' : '#112240'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(74, 144, 226, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

interface Certification {
  title: string;
  issuer: string;
  date: string;
  details?: string[];
}

interface CertificationsCarouselProps {
  certifications: Certification[];
}

const CertificationsCarousel: React.FC<CertificationsCarouselProps> = ({ certifications }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? certifications.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused]);

  return (
    <CarouselContainer 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CarouselTrack>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction > 0 ? 1000 : -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction < 0 ? 1000 : -1000 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            padding: '0 1rem'
          }}
        >
          <Card>
            <h3>{certifications[currentIndex].title}</h3>
            <div className="issuer">{certifications[currentIndex].issuer}</div>
            <div className="date">{certifications[currentIndex].date}</div>
            {certifications[currentIndex].details && (
              <ul>
                {certifications[currentIndex].details?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </Card>
        </motion.div>
      </CarouselTrack>

      <NavButton className="prev" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </NavButton>
      
      <NavButton className="next" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </NavButton>

      <DotsContainer>
        {certifications.map((_, index) => (
          <Dot 
            key={index} 
            active={index === currentIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default CertificationsCarousel; 
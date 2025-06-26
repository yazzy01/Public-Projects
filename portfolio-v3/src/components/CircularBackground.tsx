import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CircleContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const Circle = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  opacity: 0.1;
`;

const CircularBackground: React.FC = () => {
  return (
    <CircleContainer>
      <Circle
        size={800}
        color="#ffd700"
        initial={{ x: '30%', y: '-30%' }}
        animate={{
          x: ['30%', '32%', '30%'],
          y: ['-30%', '-28%', '-30%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <Circle
        size={400}
        color="#00ffff"
        initial={{ x: '80%', y: '60%' }}
        animate={{
          x: ['80%', '78%', '80%'],
          y: ['60%', '62%', '60%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <Circle
        size={200}
        color="#ff69b4"
        initial={{ x: '10%', y: '70%' }}
        animate={{
          x: ['10%', '12%', '10%'],
          y: ['70%', '68%', '70%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </CircleContainer>
  );
};

export default CircularBackground; 
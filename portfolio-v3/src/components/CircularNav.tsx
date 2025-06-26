import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { handleNavClick } from '../utils/smoothScroll';

const NavContainer = styled.nav`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
`;

const MenuToggle = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 2px solid #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  
  &:hover {
    background: #333;
  }
`;

const MenuItem = styled(motion.a)<{ angle: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: #333;
    transform: scale(1.1);
  }
`;

const MenuLabel = styled(motion.span)`
  position: absolute;
  right: 60px;
  background: #1a1a1a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  white-space: nowrap;
  pointer-events: none;
`;

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: 'H', href: '#home' },
  { id: 'about', label: 'About', icon: 'A', href: '#about' },
  { id: 'experience', label: 'Experience', icon: 'E', href: '#experience' },
  { id: 'certifications', label: 'Certifications', icon: 'C', href: '#certifications' },
  { id: 'contact', label: 'Contact', icon: 'C', href: '#contact' },
];

const CircularNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const radius = 120;

  const toggleMenu = () => setIsOpen(!isOpen);

  const calculatePosition = (index: number, total: number) => {
    const angle = (index * (2 * Math.PI)) / total - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <NavContainer>
      <MenuToggle
        onClick={toggleMenu}
        animate={{ rotate: isOpen ? 90 : 0 }}
      >
        ☰
      </MenuToggle>
      <AnimatePresence>
        {isOpen && menuItems.map((item, index) => {
          const position = calculatePosition(index, menuItems.length);
          return (
            <React.Fragment key={item.id}>
              <MenuItem
                href={item.href}
                angle={index}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: position.x, y: position.y, opacity: 1 }}
                exit={{ x: 0, y: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.icon}
              </MenuItem>
              {hoveredItem === item.id && (
                <MenuLabel
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {item.label}
                </MenuLabel>
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </NavContainer>
  );
};

export default CircularNav; 
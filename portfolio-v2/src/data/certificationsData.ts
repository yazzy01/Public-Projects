export interface Certification {
  title: string;
  issuer: string;
  date: string;
  details?: string[];
}

const certificationsData: Certification[] = [
  {
    title: "Digital AI Architect: Mastering Web Development and Intelligent Systems",
    issuer: "Digital Maroc School",
    date: "Present",
    details: [
      "Web Development and Intelligent Systems",
      "AI Integration and Implementation",
      "Advanced Web Technologies"
    ]
  },
  {
    title: "Backend Development Certification",
    issuer: "ALX",
    date: "01/2025",
    details: [
      "Specialized in AI integration and testing",
      "Focus on scalable backend architectures",
      "Quality assurance automation"
    ]
  },
  {
    title: "Founder Academy Certification",
    issuer: "ALX",
    date: "12/2024",
    details: [
      "Entrepreneurial leadership and innovation",
      "Tech startup development",
      "Business strategy for technical founders"
    ]
  },
  {
    title: "Professional Foundations Certificate",
    issuer: "ALX",
    date: "08/2024",
    details: [
      "Core professional competencies",
      "Communication and collaboration",
      "Project management fundamentals"
    ]
  },
  {
    title: "AI Career Essentials Certificate",
    issuer: "ALX",
    date: "06/2024",
    details: [
      "Foundation in AI concepts and applications",
      "Machine learning fundamentals",
      "AI ethics and responsible development"
    ]
  }
];

export default certificationsData; 
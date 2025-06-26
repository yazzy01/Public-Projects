export interface Skill {
  name: string;
  items: string[];
}

const skillsData: Skill[] = [
  {
    name: "Backend Development",
    items: [
      "Python",
      "API Development",
      "Database Management"
    ]
  },
  {
    name: "Quality Systems",
    items: [
      "Quality Management Systems (QMS)",
      "Regulatory Compliance",
      "Process Optimization"
    ]
  },
  {
    name: "AI & Data",
    items: [
      "Data Annotation",
      "Machine Learning Testing",
      "AI Model Validation",
      "RLHF (Reinforcement Learning from Human Feedback)"
    ]
  },
  {
    name: "Languages",
    items: [
      "Arabic (Native - Multiple dialects)",
      "French (Professional)",
      "English (Professional)"
    ]
  }
];

export default skillsData; 
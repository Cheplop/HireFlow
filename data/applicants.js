export const applicants = [
  {
    id: 1,
    name: "Maria Santos",
    avatar: require("../assets/images/Hireflow.png"),
    appliedJobIds: [1, 5],
    applicationStatuses: { 1: "Pending", 5: "Accepted" },
    education: "BS Computer Science, UP Diliman (2023)",
    experience: "2 yrs — Junior Frontend Developer at TechCorp",
    skills: ["React Native", "JavaScript", "Figma"],
    contactEmail: "maria.santos@example.com",
    contactPhone: "0917-123-4567",
    about:
      "Frontend developer passionate about clean UI and accessible design.",
  },
  {
    id: 2,
    name: "Joshua Dela Cruz",
    avatar: require("../assets/images/google.png"),
    appliedJobIds: [1, 2],
    applicationStatuses: { 1: "Declined", 2: "Pending" },
    education: "BS Information Technology, Ateneo de Davao (2022)",
    experience: "3 yrs — Backend Developer at CloudNine Solutions",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    contactEmail: "joshua.delacruz@example.com",
    contactPhone: "0918-234-5678",
    about:
      "Backend engineer focused on scalable APIs and cloud infrastructure.",
  },
  {
    id: 3,
    name: "Angela Reyes",
    avatar: require("../assets/images/icon.png"),
    appliedJobIds: [5],
    applicationStatuses: { 5: "Pending" },
    education: "BS Industrial Design, UST (2024)",
    experience: "1 yr — UI Design Intern at PixelWorks",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    contactEmail: "angela.reyes@example.com",
    contactPhone: "0919-345-6789",
    about:
      "Product designer who loves turning messy requirements into simple flows.",
  },
  {
    id: 4,
    name: "Kevin Lim",
    avatar: require("../assets/images/react-logo.png"),
    appliedJobIds: [2, 3],
    applicationStatuses: { 2: "Accepted", 3: "Pending" },
    education: "BS Computer Engineering, USC (2021)",
    experience: "4 yrs — Full Stack Developer at InnoTech",
    skills: ["React", "Python", "Docker", "MongoDB"],
    contactEmail: "kevin.lim@example.com",
    contactPhone: "0920-456-7890",
    about:
      "Full stack developer experienced in shipping cross-platform products.",
  },
  {
    id: 5,
    name: "Patricia Garcia",
    avatar: require("../assets/images/Hireflow.png"),
    appliedJobIds: [3, 4],
    applicationStatuses: { 3: "Declined", 4: "Pending" },
    education: "BS Software Engineering, MSU-IIT (2023)",
    experience: "2 yrs — Systems Developer at DataHub",
    skills: ["Java", "Spring Boot", "Kubernetes"],
    contactEmail: "patricia.garcia@example.com",
    contactPhone: "0921-567-8901",
    about: "Systems developer with a strong backend and DevOps background.",
  },
  {
    id: 6,
    name: "Gabriel Torres",
    avatar: require("../assets/images/google.png"),
    appliedJobIds: [4],
    applicationStatuses: { 4: "Accepted" },
    education: "BS Computer Science, AIM (2020)",
    experience: "5 yrs — Lead Developer at StartupLab",
    skills: ["React Native", "TypeScript", "GraphQL", "Team Leadership"],
    contactEmail: "gabriel.torres@example.com",
    contactPhone: "0922-678-9012",
    about: "Lead developer who mentors teams and architects scalable apps.",
  },
];

export function getApplicantById(id) {
  return applicants.find((applicant) => String(applicant.id) === String(id));
}

export function getApplicantsByJob(jobId) {
  return applicants.filter((applicant) =>
    applicant.appliedJobIds.includes(Number(jobId)),
  );
}

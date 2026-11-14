export const sections = ['Education', 'Job Experience', 'Licenses & Cert', 'About'];

export const EDUCATION_GROUPS = ['Tertiary', 'Secondary', 'Primary', 'Other'];
export const PHOTO_STORAGE_KEY = '@hireflow/profile-photos';

export const FORMS = {
  profile: {
    title: 'profile',
    fields: [
      { key: 'name', label: 'Full name', required: true },
      { key: 'location', label: 'Location' },
    ],
  },
  education: {
    title: 'education',
    hasGroup: true,
    fields: [
      { key: 'title', label: 'School / University', required: true },
      { key: 'subtitle', label: 'Degree / Program' },
      { key: 'date', label: 'Years (e.g. 2016–2020)' },
    ],
  },
  experience: {
    title: 'job experience',
    fields: [
      { key: 'title', label: 'Job title', required: true },
      { key: 'subtitle', label: 'Company' },
      { key: 'date', label: 'Years (e.g. 2021–2025)' },
      { key: 'location', label: 'Location / Work setup' },
      { key: 'type', label: 'Employment type (e.g. Full-time)' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  certificates: {
    title: 'license or certificate',
    fields: [
      { key: 'title', label: 'Name', required: true },
      { key: 'subtitle', label: 'Issuer' },
      { key: 'date', label: 'Year' },
    ],
  },
  about: {
    title: 'about',
    fields: [
      { key: 'text', label: 'About me', multiline: true },
      { key: 'skills', label: 'Skills (separate with commas)' },
      { key: 'availability', label: 'Availability message' },
    ],
  },
};

export const initialEducation = [
  {
    id: 'edu-1',
    group: 'Tertiary',
    title: 'Harvard University',
    subtitle: 'B.S in Information Technology',
    date: '2016–2020',
  },
  {
    id: 'edu-2',
    group: 'Secondary',
    title: 'Cagayan de Oro City National High School',
    subtitle: 'High School Diploma',
    date: '2012–2016',
  },
  {
    id: 'edu-3',
    group: 'Primary',
    title: 'Cagayan de Oro City Central School',
    subtitle: 'Elementary Education',
    date: '2006–2012',
  },
];

export const initialExperience = [
  {
    id: 'exp-1',
    title: 'Senior Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2021–2025',
    details: ['Quezon City, Philippines / Onsite', 'Full-time'],
    description:
      'Designed and developed responsive web applications, working with product and engineering teams to deliver reliable user experiences.',
  },
  {
    id: 'exp-2',
    title: 'Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2018–2021',
    details: ['Cagayan de Oro City / Hybrid', 'Full-time'],
    description:
      'Built and maintained customer-facing web features and collaborated on accessibility and performance improvements.',
  },
];

export const initialCertificates = [
  {
    id: 'cert-1',
    title: 'Senior Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2021–2025',
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Developer',
    subtitle: 'Amazon Web Services',
    date: '2023',
  },
  {
    id: 'cert-3',
    title: 'Professional Web Accessibility',
    subtitle: 'W3C Training',
    date: '2022',
  },
];

export const initialProfile = {
  name: 'Juan Dela Cruz',
  location: 'Cagayan de Oro City',
};

export const initialAbout = {
  text:
    'A passionate web developer with experience building accessible, user-friendly products. I enjoy solving problems and collaborating with teams to turn ideas into useful experiences.',
  skills: ['Web Development', 'JavaScript', 'UI/UX', 'Communication'],
  availability: 'Available for new opportunities',
};

export const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

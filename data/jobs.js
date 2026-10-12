export const productItems = [
  {
    id: 1,
    name: "Clown",
    company: "Happy Days Events",
    location: "Quezon City",
    description: "Perform at kids' parties and corporate events. Prior balloon-animal experience is a plus.",
  },
  {
    id: 2,
    name: "IT Support",
    company: "Northwind Systems",
    location: "Makati",
    description: "Help desk role covering hardware setup, account access, and first-line troubleshooting.",
  },
  {
    id: 3,
    name: "UX Designer",
    company: "Flow Studio",
    location: "Remote",
    description: "Design mobile flows for job seekers. You will work with product and engineering on HireFlow-style apps.",
  },
  {
    id: 4,
    name: "Web Developer",
    company: "Brightline Labs",
    location: "Cebu",
    description: "Build and maintain React Native and web screens. Comfort with JavaScript and Expo is preferred.",
  },
  {
    id: 5,
    name: "Tambay Coordinator",
    company: "Community Hub",
    location: "Pasig",
    description: "Organize community hangouts, keep a sign-in list, and help people find local gigs.",
  },
];

export function getJobById(id) {
  const jobId = Number(id);
  return (
    productItems.find((item) => item.id === jobId) || {
      id: jobId,
      name: "Unknown job",
      company: "—",
      location: "—",
      description: "No details available for this listing.",
    }
  );
}

export function filterJobs(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return productItems;
  }

  return productItems.filter((job) => {
    const haystack = `${job.name} ${job.company} ${job.location}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

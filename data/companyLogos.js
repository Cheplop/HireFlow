const favicon = (domain) => ({
  uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
});

export const companyLogos = {
  google: favicon("google.com"),
  amazon: favicon("amazon.com"),
  nasa: favicon("nasa.gov"),
  aws: favicon("aws.amazon.com"),
  w3c: favicon("w3.org"),
  hireflow: require("../assets/images/Hireflow.png"),
};

export const schoolLogos = {
  harvard: favicon("harvard.edu"),
  newYork: favicon("schools.nyc.gov"),
};

export function getOrganizationLogo(name) {
  const organization = typeof name === "string" ? name.toLowerCase() : "";

  if (organization.includes("amazon web services") || organization.includes("aws")) {
    return companyLogos.aws;
  }
  if (organization.includes("amazon")) return companyLogos.amazon;
  if (organization.includes("google")) return companyLogos.google;
  if (organization.includes("nasa")) return companyLogos.nasa;
  if (organization.includes("w3c")) return companyLogos.w3c;
  if (organization.includes("hireflow")) return companyLogos.hireflow;
  return null;
}

export function getSchoolLogo(name) {
  const school = typeof name === "string" ? name.toLowerCase() : "";

  if (school.includes("harvard")) return schoolLogos.harvard;
  if (school.includes("new york")) return schoolLogos.newYork;
  return null;
}

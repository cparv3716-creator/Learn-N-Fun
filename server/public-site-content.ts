import "server-only";

export type PublicContactDetail = {
  description: string;
  title: string;
  value: string;
};

function getTrimmedEnv(name: string, fallback: string) {
  const value = process.env[name]?.trim();
  return value || fallback;
}

export function getPublicContactInfo() {
  return {
    address: getTrimmedEnv(
      "SITE_ADDRESS",
      "18 Bright Minds Avenue, Anna Nagar, Chennai",
    ),
    email: getTrimmedEnv("SITE_EMAIL", "hello@learnnfunabacus.com"),
    hours: getTrimmedEnv("SITE_HOURS", "Mon-Sat, 9:00 AM to 7:00 PM"),
    phone: getTrimmedEnv("SITE_PHONE", "+91 98765 43210"),
  };
}

export function getPublicContactDetails(): PublicContactDetail[] {
  const contact = getPublicContactInfo();

  return [
    {
      title: "Call us",
      value: contact.phone,
      description:
        "Speak with the admissions team about batches, age groups, and current openings.",
    },
    {
      title: "Email us",
      value: contact.email,
      description:
        "Best for detailed questions, partnership conversations, or franchise requests.",
    },
    {
      title: "Visit us",
      value: contact.address,
      description:
        "A welcoming center environment with child-friendly spaces and parent guidance support.",
    },
    {
      title: "Office hours",
      value: contact.hours,
      description:
        "Reach us during these hours for the fastest response from the team.",
    },
  ];
}

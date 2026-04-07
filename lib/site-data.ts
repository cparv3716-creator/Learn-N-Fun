export type NavigationItem = {
  href: string;
  label: string;
};

export type Program = {
  ageRange: string;
  description: string;
  duration: string;
  format: string;
  highlights: string[];
  name: string;
};

export type Testimonial = {
  childName: string;
  parentName: string;
  program: string;
  quote: string;
};

type Value = {
  description: string;
  kicker: string;
  title: string;
};

type Milestone = {
  description: string;
  title: string;
  year: string;
};

type TeamMember = {
  bio: string;
  name: string;
  role: string;
};

type DetailCard = {
  description: string;
  title: string;
  value: string;
};

type Step = {
  description: string;
  title: string;
};

type Benefit = {
  description: string;
  kicker: string;
  title: string;
};

type CompanyInfo = {
  contact: {
    address: string;
    email: string;
    hours: string;
    phone: string;
  };
  shortDescription: string;
  story: string[];
};

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/book-demo", label: "Book Demo" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/franchise", label: "Franchise" },
];

export const companyInfo: CompanyInfo = {
  shortDescription:
    "Learn 'N' Fun Abacus delivers abacus and mental math training for children through age-based programs, caring instructors, and parent-friendly progress communication.",
  contact: {
    phone: "+91 98765 43210",
    email: "hello@learnnfunabacus.com",
    address: "18 Bright Minds Avenue, Anna Nagar, Chennai",
    hours: "Mon-Sat, 9:00 AM to 7:00 PM",
  },
  story: [
    "Learn 'N' Fun Abacus began with a simple goal: help children enjoy the process of becoming sharper thinkers instead of treating math practice like pressure.",
    "We built our programs to combine structured abacus training with warm teacher guidance, so students improve concentration, memory, and confidence alongside mental calculation speed.",
    "Today, the company is designed to serve both families and future franchise partners with a dependable, child-centered learning model that can scale without losing its personality.",
  ],
};

export const companyStats = [
  { value: "Ages 5-14", label: "Programs designed for early mental math learners" },
  { value: "Small batches", label: "Attention-friendly class environments" },
  { value: "Hybrid-ready", label: "Online and in-center delivery options" },
  { value: "Parent updates", label: "Clear progress guidance for families" },
];

export const programs: Program[] = [
  {
    name: "Spark Beginners",
    ageRange: "Ages 5-7",
    duration: "24-week foundation track",
    format: "Twice-weekly small group classes",
    description:
      "A gentle entry point for younger learners who need movement, rhythm, and repetition before speed becomes the focus.",
    highlights: [
      "Number familiarity through tactile abacus work",
      "Short, attention-friendly lesson structure",
      "Confidence-building activities for first-time learners",
    ],
  },
  {
    name: "Focus Builders",
    ageRange: "Ages 8-10",
    duration: "36-week skill-building journey",
    format: "Weekday and weekend hybrid-friendly batches",
    description:
      "A balanced program for children ready to strengthen accuracy, concentration, and faster visualisation techniques.",
    highlights: [
      "Progressive mental math transitions",
      "Timed practice with calm coaching support",
      "Monthly progress checkpoints parents can understand",
    ],
  },
  {
    name: "Championship Track",
    ageRange: "Ages 10-14",
    duration: "Advanced multi-level mastery path",
    format: "High-focus batches with challenge sessions",
    description:
      "An advanced path for children who enjoy challenge, goal setting, and more visible speed-and-accuracy milestones.",
    highlights: [
      "Competition-style drills and accuracy refinement",
      "Presentation confidence and stage-readiness exercises",
      "Higher-level visualization and mental stamina training",
    ],
  },
];

export const values: Value[] = [
  {
    kicker: "01",
    title: "Joyful structure",
    description:
      "Children learn best when the classroom feels energetic and clear at the same time. We design sessions to feel inviting without becoming loose.",
  },
  {
    kicker: "02",
    title: "Visible progress",
    description:
      "Parents deserve a clear picture of what is improving. Our program milestones are designed to make growth tangible and easy to discuss.",
  },
  {
    kicker: "03",
    title: "Confidence first",
    description:
      "Strong performance grows from calm confidence. We coach children to trust the process, attempt challenges, and recover quickly from mistakes.",
  },
  {
    kicker: "04",
    title: "Parent partnership",
    description:
      "We keep communication simple and supportive, so families feel informed rather than overwhelmed by technical classroom language.",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2013",
    title: "The first center opens",
    description:
      "A single neighborhood batch became the starting point for a child-first abacus teaching approach.",
  },
  {
    year: "2017",
    title: "Curriculum system refined",
    description:
      "The teaching flow was formalized into structured levels with clearer parent communication and assessment checkpoints.",
  },
  {
    year: "2020",
    title: "Hybrid-ready delivery introduced",
    description:
      "The classroom model expanded to support flexible scheduling while protecting the same teaching rhythm.",
  },
  {
    year: "2025",
    title: "Franchise roadmap prepared",
    description:
      "The brand, curriculum, and operational systems were organized to support quality-led regional expansion.",
  },
];

export const leadershipTeam: TeamMember[] = [
  {
    name: "Radhika Menon",
    role: "Founder & Academic Director",
    bio: "Radhika leads curriculum design and ensures that every level keeps the right balance of rigor, warmth, and child psychology.",
  },
  {
    name: "Arjun Sethi",
    role: "Operations & Partner Growth",
    bio: "Arjun focuses on systems, onboarding, and turning a strong classroom experience into a repeatable business model for future centers.",
  },
  {
    name: "Maya Thomas",
    role: "Parent Experience Lead",
    bio: "Maya shapes communication, progress reporting, and support touchpoints so parents feel guided through each stage of the journey.",
  },
];

export const trainingFormats: Step[] = [
  {
    title: "Small batches",
    description:
      "Keeps the class personal enough for correction, encouragement, and healthy participation.",
  },
  {
    title: "Weekend options",
    description:
      "Built for busy school schedules and families who need flexibility without sacrificing consistency.",
  },
  {
    title: "Hybrid-ready routines",
    description:
      "Useful for continuity when travel, weather, or local scheduling issues interrupt in-person attendance.",
  },
  {
    title: "Practice rhythm",
    description:
      "Short home practice recommendations help children stay steady between sessions without burnout.",
  },
];

export const learningJourney: Step[] = [
  {
    title: "Assessment",
    description:
      "We understand the child's age, attention style, and learning comfort before recommending the right starting point.",
  },
  {
    title: "Foundation",
    description:
      "Children learn the abacus method with repetition, rhythm, and teacher support until the basics feel natural.",
  },
  {
    title: "Acceleration",
    description:
      "Mental visualization, accuracy, and speed are introduced in a way that still feels achievable and motivating.",
  },
  {
    title: "Confidence showcase",
    description:
      "Children experience visible achievement through checkpoints, presentations, and challenge moments they can feel proud of.",
  },
];

export const testimonials: Testimonial[] = [
  {
    parentName: "Spark Beginners family",
    childName: "early learner",
    program: "Spark Beginners",
    quote:
      "The class experience feels warm and age-appropriate, and our child is noticeably more comfortable with numbers.",
  },
  {
    parentName: "Focus Builders family",
    childName: "developing learner",
    program: "Focus Builders",
    quote:
      "We joined for mental math support, but the bigger difference has been calmer focus and better confidence during homework.",
  },
  {
    parentName: "Championship Track family",
    childName: "advanced learner",
    program: "Championship Track",
    quote:
      "The challenge level feels motivating, and the structured progression helps children grow into visible confidence.",
  },
  {
    parentName: "Admissions parent",
    childName: "new student",
    program: "Spark Beginners",
    quote:
      "The onboarding flow feels thoughtful and clear. We always know what the next step is and how to support practice at home.",
  },
  {
    parentName: "Parent support feedback",
    childName: "regular learner",
    program: "Focus Builders",
    quote:
      "The progress communication feels polished and professional, but the classroom tone still stays warm and child-friendly.",
  },
  {
    parentName: "Senior level family",
    childName: "confident learner",
    program: "Championship Track",
    quote:
      "Children are pushed in a healthy, encouraging way, and the challenge starts to feel exciting instead of intimidating.",
  },
];

export const demoExpectations: Step[] = [
  {
    title: "Quick parent conversation",
    description:
      "We understand your child's age, schedule, previous activity exposure, and learning goals.",
  },
  {
    title: "Sample class experience",
    description:
      "Your child gets a real feel for the tone, pace, and energy of a Learn 'N' Fun session.",
  },
  {
    title: "Level recommendation",
    description:
      "Our team suggests the most suitable starting batch and explains what early progress usually looks like.",
  },
  {
    title: "Clear next steps",
    description:
      "You leave with batch options, expectations, and enough detail to decide with confidence.",
  },
];

export const contactDetails: DetailCard[] = [
  {
    title: "Call us",
    value: companyInfo.contact.phone,
    description:
      "Speak with the admissions team about batches, age groups, and current openings.",
  },
  {
    title: "Email us",
    value: companyInfo.contact.email,
    description:
      "Best for detailed questions, partnership conversations, or franchise requests.",
  },
  {
    title: "Visit us",
    value: companyInfo.contact.address,
    description:
      "A welcoming center environment with child-friendly spaces and parent guidance support.",
  },
  {
    title: "Office hours",
    value: companyInfo.contact.hours,
    description:
      "Reach us during these hours for the fastest response from the team.",
  },
];

export const franchiseBenefits: Benefit[] = [
  {
    kicker: "Brand",
    title: "Trusted positioning",
    description:
      "Launch under a brand built around quality teaching, parent trust, and clear child outcomes.",
  },
  {
    kicker: "Academics",
    title: "Structured curriculum",
    description:
      "Receive classroom-ready program flows, level logic, and progress checkpoints that are easy to operate.",
  },
  {
    kicker: "Operations",
    title: "Launch support",
    description:
      "Get guidance on center setup, trainer onboarding, parent onboarding, and day-to-day rhythm.",
  },
  {
    kicker: "Growth",
    title: "Scalable model",
    description:
      "Build a center that can grow responsibly while maintaining a consistent teaching experience.",
  },
];

export const franchiseSteps: Step[] = [
  {
    title: "Discovery conversation",
    description:
      "We discuss your city, goals, background, and what a Learn 'N' Fun center would look like in your market.",
  },
  {
    title: "Model walkthrough",
    description:
      "You receive a clear overview of brand positioning, support scope, operations, and launch expectations.",
  },
  {
    title: "Planning and onboarding",
    description:
      "Once aligned, we move into setup planning, training, and launch preparation for your local center.",
  },
  {
    title: "Center launch support",
    description:
      "We stay involved through early rollout so your systems, delivery, and parent communication start strong.",
  },
];

export const faqItems = [
  {
    question: "Do I need prior education business experience?",
    answer:
      "Not necessarily. What matters most is commitment to quality delivery, local execution discipline, and alignment with the brand's child-first philosophy.",
  },
  {
    question: "Will franchise partners receive academic support?",
    answer:
      "Yes. Curriculum structure, onboarding guidance, and teaching system support are part of the future-ready franchise model.",
  },
  {
    question: "Can the program work in different city sizes?",
    answer:
      "Yes. The model is designed to adapt to neighborhood centers, school tie-ups, and local parent communities in multiple market contexts.",
  },
  {
    question: "Is marketing support part of the partnership?",
    answer:
      "Yes. Foundational campaign assets and parent communication templates are planned as part of the support structure.",
  },
];

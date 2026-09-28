/**
 * TRAC REQUEST - Centralized Configuration
 * Tawi-Tawi Regional Agricultural College
 *
 * v1: Reuses MSU-TCTO queue/auth/status workflow
 * All school-specific constants are configurable here
 * Future enhancements: fee formulas, richer policy rules
 */

// ============================================================
// SCHOOL IDENTITY
// ============================================================
export const SCHOOL = {
  shortName: "TRAC",
  systemName: "TRAC REQUEST",
  fullName: "Tawi-Tawi Regional Agricultural College",
  subtitle: "Online Request and Tracking with Email Notifications",
  logo: "/TracLogo.png",
  logoFallback: "/TracLogo.png",
  footer: {
    copyright: "Tawi-Tawi Regional Agricultural College",
    campus: "Tawi-Tawi Regional Agricultural College",
    location: "Nalil, Bongao, Tawi-Tawi",
    shortLocation: "Bongao, Tawi-Tawi",
  },
  contact: {
    email: "registrar@trac.edu.ph",
    altEmail: "registraroffice@trac.edu.ph",
    phone: "(068) 123-4567",
    location: "Registrar Office, TRAC, Nalil, Bongao Tawi-Tawi",
    officeLocation: "Office of the Campus Registrar, TRAC, Nalil, Bongao, Tawi-Tawi 7500",
  }
};

// ============================================================
// THEME - TRAC Green & Gold (Agricultural)
// ============================================================
export const THEME = {
  // Primary - Deep Agricultural Green
  primary: "#1B5E20",
  primaryDark: "#0D3B10",
  primaryLight: "#2E7D32",
  primaryLighter: "#388E3C",
  primaryExtraLight: "#43A047",

  // Secondary - Harvest Gold / Amber
  secondary: "#F9A825",
  secondaryDark: "#F57F17",
  secondaryLight: "#FBC02D",
  secondaryLighter: "#FDD835",

  // Accent & Neutrals
  accent: "#33691E",
  accentLight: "#558B2F",
  background: "#F1F8E9",
  backgroundLight: "#F9FBE7",
  surface: "#FFFFFF",

  // Legacy mapping for easy migration from MSU colors
  // Old: #7A0019 (maroon) -> new primary green
  // Old: #0038A8 (blue) -> new primary light / accent
  legacy: {
    maroon: "#1B5E20",
    maroonDark: "#0D3B10",
    blue: "#2E7D32",
    blueDark: "#1B5E20",
    maroonGradient: "#7A0019", // kept for reference
    blueGradient: "#0038A8",
  },

  // Gradients - TRAC Green to Gold
  gradients: {
    primaryToSecondary: "from-[#1B5E20] to-[#F9A825]",
    primaryToAccent: "from-[#1B5E20] to-[#2E7D32]",
    primaryToGold: "from-[#1B5E20] to-[#F9A825]",
    header: "from-[#1B5E20] to-[#2E7D32]",
    headerFull: "from-[#1B5E20] via-[#2E7D32] to-[#33691E]",
    button: "from-[#1B5E20] to-[#2E7D32]",
    buttonHover: "from-[#2E7D32] to-[#1B5E20]",
    card: "from-[#1B5E20]/5 to-[#F9A825]/5",
    cardStrong: "from-[#1B5E20]/10 to-[#F9A825]/10",
    success: "from-green-600 to-emerald-600",
    background: "from-white to-[#F1F8E9]",
    backgroundStrong: "from-[#F1F8E9] to-[#DCEDC8]",
  },

  // For Tailwind CSS variables
  cssVariables: {
    "--trac-primary": "#1B5E20",
    "--trac-primary-dark": "#0D3B10",
    "--trac-primary-light": "#2E7D32",
    "--trac-secondary": "#F9A825",
    "--trac-secondary-dark": "#F57F17",
    "--trac-accent": "#33691E",
  }
};

// ============================================================
// OFFICE SCHEDULE & PROCESSING
// ============================================================
export const OFFICE = {
  schedule: {
    days: "Monday to Friday",
    morning: "8:00 AM – 11:45 AM",
    afternoon: "1:00 PM – 5:00 PM",
    lunchBreak: "11:45 AM – 1:00 PM",
    full: "Monday-Friday, 8:00 AM – 11:45 AM, 1:00 PM – 5:00 PM",
    display: "Monday-Friday, 8:00 AM - 4:45 PM",
    short: "Mon-Fri: 8:00 AM - 4:45 PM",
    closedNote: "Closed during lunch break (11:45 AM - 1:00 PM)",
    weekends: "Closed",
  },
  processing: {
    note: "First-come, first-served basis. Processing time depends on number of requests and queue length.",
    regular: "3–5 Business Days",
    documents: "1-6 working days",
    forms: "1 working day",
    rushNote: "When there are few people in line, requests are processed quickly. During peak, may take longer.",
  },
  pickup: {
    required: ["Valid ID", "Official Receipt from Cashier", "Authorization Letter (if representative)"],
    validity: "Claim within 30 days, otherwise document will be forfeited.",
  }
};

// ============================================================
// ACADEMIC PROGRAMS - TRAC
// ============================================================
export const PROGRAMS = {
  institutes: [
    {
      code: "ICS",
      name: "Institute of Computing Studies",
      shortName: "ICS",
      programs: [
        { code: "BSIT", name: "Bachelor of Science in Information Technology", abbr: "BSIT" },
        { code: "BSIS", name: "Bachelor of Science in Information Systems", abbr: "BSIS" },
      ]
    },
    {
      code: "ISCJS",
      name: "Institute of Social and Criminal Justice Studies",
      shortName: "ISCJS",
      programs: [
        { code: "BSCRIM", name: "Bachelor of Science in Criminology", abbr: "BSCRIM" },
      ]
    },
    {
      code: "IVTES",
      name: "Institute of Vocational and Technical Education Studies",
      shortName: "IVTES",
      programs: [
        { code: "BTVTED", name: "Bachelor of Technical-Vocational Teacher Education", abbr: "BTVTED" },
        { code: "BTLED", name: "Bachelor of Technology and Livelihood Education", abbr: "BTLED" },
        { code: "BSHM", name: "Bachelor of Science in Hospitality Management", abbr: "BSHM" },
        { code: "BSHRRM", name: "Bachelor of Science in Hotel and Restaurant Resource Management", abbr: "BSHRRM" },
        { code: "BSHT", name: "Bachelor of Science in Hospitality and Tourism", abbr: "BSHT" },
      ]
    },
    {
      code: "IAS",
      name: "Institute of Agricultural Sciences",
      shortName: "IAS",
      programs: [
        { code: "BSA", name: "Bachelor of Science in Agriculture", abbr: "BSA" },
        { code: "BSF", name: "Bachelor of Science in Forestry", abbr: "BSF" },
        { code: "BSAB", name: "Bachelor of Science in Agribusiness", abbr: "BSAB" },
      ]
    },
    {
      code: "GS",
      name: "Graduate Studies",
      shortName: "GS",
      programs: [
        { code: "MAEd", name: "Master of Arts in Education", abbr: "MAEd" },
        { code: "MSA", name: "Master of Science in Agriculture", abbr: "MSA" },
        { code: "MSAgEd", name: "Master of Science in Agricultural Education", abbr: "MSAgEd" },
        { code: "MSAg.Mgt.", name: "Master of Science in Agricultural Management", abbr: "MSAg.Mgt." },
      ]
    },
  ]
};

// ============================================================
// DEPARTMENTS - Derived from Institutes for Auth Compatibility
// ============================================================
export const DEPARTMENTS = PROGRAMS.institutes.map(inst => ({
  code: inst.code,
  name: `${inst.code} - ${inst.name}`,
  fullName: inst.name,
}));

// Flat course list for dropdowns
export const ALL_COURSES = PROGRAMS.institutes.flatMap(inst =>
  inst.programs.map(p => p.name)
);

// Course -> Department Map
export const COURSE_DEPARTMENT_MAP = {};
PROGRAMS.institutes.forEach(inst => {
  inst.programs.forEach(prog => {
    COURSE_DEPARTMENT_MAP[prog.name] = inst.code;
  });
});

// Department -> Courses Map
export const DEPARTMENT_COURSE_MAP = {};
PROGRAMS.institutes.forEach(inst => {
  DEPARTMENT_COURSE_MAP[inst.code] = inst.programs.map(p => p.name);
});

// ============================================================
// MANUAL PROCESS DOCUMENTATION
// ============================================================
export const MANUAL_PROCESSES = {
  general: "Before proceeding, follow process in Question No. 6. Depending on number of requests, wait in line before document is released.",
  tor: {
    title: "Transcript of Records (TOR) Process",
    steps: [
      "Proceed to respective department and obtain clearance",
      "Proceed to library for clearance",
      "Proceed to cashier",
      "Proceed to Registrar's Office",
      "Return to cashier, if required",
      "Wait for TOR to be processed and released"
    ],
    requirements: ["Bound thesis", "Diploma", "Permanent Record"],
  },
  cog: {
    title: "Certificate of Grades (COG) Process",
    steps: [
      "Obtain Evaluation Form from department",
      "Fill out Evaluation Form completely",
      "Bring green form to cashier and pay required fee",
      "Return to Registrar's Office and submit completed form",
      "Wait for Certificate of Grades to be processed and released"
    ]
  },
  adding: {
    title: "Adding Form / Adding Subject Process",
    steps: [
      "Obtain Adding Form from Registrar's Office",
      "Fill out form completely",
      "Proceed to faculty member in charge of subject",
      "Have required approval or signature completed"
    ]
  },
  cor: {
    title: "Certificate of Registration (COR) Process",
    steps: [
      "Obtain Official Receipt (OR) from Cashier's Office",
      "Proceed to Registrar's Office for processing",
      "Wait for Certificate of Registration to be processed and released"
    ]
  },
  honorable: {
    title: "Honorable Dismissal Process",
    steps: [
      "Obtain required Official Receipt (OR) from Cashier's Office",
      "Proceed to appropriate department",
      "Follow department's processing requirements for Honorable Dismissal"
    ]
  },
  shifting: {
    title: "Shifting Form Process",
    steps: [
      "Obtain Shifting Form and Evaluation Form from student's current department",
      "Complete required information and signatures",
      "Submit forms to department where student wishes to shift"
    ]
  },
  inc: {
    title: "Incomplete (INC) Form Process",
    note: "Generally same as COR process. However, INC Form can usually be released immediately because form is already pre-printed."
  }
};

// ============================================================
// ABBREVIATIONS
// ============================================================
export const ABBREVIATIONS = {
  "COG": "Certificate of Grades",
  "COR": "Certificate of Registration",
  "GWA": "General Weighted Average",
  "CAV": "Certification, Authentication, and Verification",
  "INC Form": "Incomplete Form",
  "TOR": "Transcript of Records",
  "BSIT": "Bachelor of Science in Information Technology",
  "BSIS": "Bachelor of Science in Information Systems",
  "BSCRIM": "Bachelor of Science in Criminology",
  "BTVTED": "Bachelor of Technical-Vocational Teacher Education",
  "BTLED": "Bachelor of Technology and Livelihood Education",
  "BSHM": "Bachelor of Science in Hospitality Management",
  "BSHRRM": "Bachelor of Science in Hotel and Restaurant Resource Management",
  "BSHT": "Bachelor of Science in Hospitality and Tourism",
  "BSA": "Bachelor of Science in Agriculture",
  "BSF": "Bachelor of Science in Forestry",
  "BSAB": "Bachelor of Science in Agribusiness",
};

// ============================================================
// API & SYSTEM SETTINGS (Keep workflow same as MSU for v1)
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const SYSTEM = {
  // Keep same queue/auth/status workflow for v1
  apiBaseUrl: API_BASE_URL,
  auth: {
    idFormat: "00-00000",
    idRegex: /^\d{7}$/,
    passwordRequirements: {
      minLength: 8,
      requireUpper: true,
      requireLower: true,
      requireNumber: true,
      requireSpecial: true,
    }
  },
  queue: {
    avgProcessingTime: 10, // minutes per request
    refreshInterval: 15000, // 15 seconds
  },
  requests: {
    maxCopies: 5,
    maxCopiesPerForm: 1,
    allowMultipleFor: ["INC Form", "Incomplete (INC) Form"],
  }
};

// ============================================================
// DEFAULT EXPORT - Full Config
// ============================================================
const TRAC_CONFIG = {
  school: SCHOOL,
  theme: THEME,
  office: OFFICE,
  programs: PROGRAMS,
  departments: DEPARTMENTS,
  allCourses: ALL_COURSES,
  courseDepartmentMap: COURSE_DEPARTMENT_MAP,
  departmentCourseMap: DEPARTMENT_COURSE_MAP,
  manualProcesses: MANUAL_PROCESSES,
  abbreviations: ABBREVIATIONS,
  system: SYSTEM,
};

export default TRAC_CONFIG;

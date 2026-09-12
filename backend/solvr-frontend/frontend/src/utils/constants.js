export const DIFFICULTY_META = {
  EASY: { label: "Easy", color: "var(--easy)", bg: "var(--easy-bg)" },
  MEDIUM: { label: "Medium", color: "var(--medium)", bg: "var(--medium-bg)" },
  HARD: { label: "Hard", color: "var(--hard)", bg: "var(--hard-bg)" },
};

export const STATUS_META = {
  NOT_STARTED: { label: "Not started", color: "#8b8fa3", bg: "#eef0f4" },
  IN_PROGRESS: {
    label: "In progress",
    color: "var(--medium)",
    bg: "var(--medium-bg)",
  },
  SOLVED: { label: "Solved", color: "var(--easy)", bg: "var(--easy-bg)" },
  MASTERED: {
    label: "Mastered",
    color: "var(--violet)",
    bg: "var(--violet-light)",
  },
};

export const ROADMAP_LEVEL_META = {
  BEGINNER: { label: "Beginner", color: "var(--easy)", bg: "var(--easy-bg)" },
  INTERMEDIATE: {
    label: "Intermediate",
    color: "var(--medium)",
    bg: "var(--medium-bg)",
  },
  ADVANCED: { label: "Advanced", color: "var(--hard)", bg: "var(--hard-bg)" },
};

export const MISTAKE_TYPE_OPTIONS = [
  "NONE",
  "LOGIC",
  "EDGE_CASE",
  "OPTIMIZATION",
  "SYNTAX",
  "MISUNDERSTOOD_PROBLEM",
];

export const PLATFORM_OPTIONS = [
  "LEETCODE",
  "GEEKSFORGEEKS",
  "CODEFORCES",
  "CODECHEF",
  "ATCODER",
  "HACKERRANK",
  "HACKEREARTH",
  "CODINGNINJAS",
  "SPOJ",
  "OTHER",
];

export const PROBLEM_STATUS_OPTIONS = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "SOLVED",
  "MASTERED",
];

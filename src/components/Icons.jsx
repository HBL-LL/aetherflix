// Brand mark: an A tipped onto its side becomes the play button. Masters live in public/brand/.
export const AetherFlixLogo = ({ style }) => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    role="img"
    aria-label="AetherFlix"
    style={{ width: "100%", height: "100%", display: "block", ...style }}
  >
    <path
      fillRule="evenodd"
      d="M66 25.07 L232.28 121.07 A8 8 0 0 1 232.28 134.93 L66 230.93 A8 8 0 0 1 54 224 L54 196.29 L90 175.5 L90 80.5 L54 59.71 L54 32 A8 8 0 0 1 66 25.07 Z M112 93.2 L172.28 128 L112 162.8 Z"
    />
  </svg>
);

const WORDMARK_PATHS = [
  "M0.0 100.0 L21.1 0.0 L38.8 0.0 L17.7 100.0 Z",
  "M60.0 100.0 L38.8 0.0 L21.1 0.0 L42.2 100.0 Z",
  "M22.6 62.0 L37.4 62.0 L37.4 77.0 L22.6 77.0 Z",
  "M72.0 0.0 L89.0 0.0 L89.0 100.0 L72.0 100.0 Z",
  "M72.0 0.0 L116.0 0.0 L116.0 17.0 L72.0 17.0 Z",
  "M72.0 41.5 L110.0 41.5 L110.0 58.5 L72.0 58.5 Z",
  "M72.0 83.0 L116.0 83.0 L116.0 100.0 L72.0 100.0 Z",
  "M128.0 0.0 L178.0 0.0 L178.0 17.0 L128.0 17.0 Z",
  "M144.5 0.0 L161.5 0.0 L161.5 100.0 L144.5 100.0 Z",
  "M190.0 0.0 L207.0 0.0 L207.0 100.0 L190.0 100.0 Z",
  "M225.0 0.0 L242.0 0.0 L242.0 100.0 L225.0 100.0 Z",
  "M190.0 41.5 L242.0 41.5 L242.0 58.5 L190.0 58.5 Z",
  "M254.0 0.0 L271.0 0.0 L271.0 100.0 L254.0 100.0 Z",
  "M254.0 0.0 L298.0 0.0 L298.0 17.0 L254.0 17.0 Z",
  "M254.0 41.5 L292.0 41.5 L292.0 58.5 L254.0 58.5 Z",
  "M254.0 83.0 L298.0 83.0 L298.0 100.0 L254.0 100.0 Z",
  "M310.0 0.0 L327.0 0.0 L327.0 100.0 L310.0 100.0 Z",
  "M310 0 H333.0 A29.0 29.0 0 0 1 333.0 58 H310 Z M327 17 V41 H333.0 A12.0 12.0 0 0 0 333.0 17 Z",
  "M319.0 41.0 L338.0 41.0 L362.0 100.0 L341.0 100.0 Z",
  "M374.0 0.0 L391.0 0.0 L391.0 100.0 L374.0 100.0 Z",
  "M374.0 0.0 L418.0 0.0 L418.0 17.0 L374.0 17.0 Z",
  "M374.0 41.5 L412.0 41.5 L412.0 58.5 L374.0 58.5 Z",
  "M430.0 0.0 L447.0 0.0 L447.0 100.0 L430.0 100.0 Z",
  "M430.0 83.0 L472.0 83.0 L472.0 100.0 L430.0 100.0 Z",
  "M484.0 0.0 L501.0 0.0 L501.0 100.0 L484.0 100.0 Z",
  "M513.0 0.0 L532.5 0.0 L569.0 100.0 L549.4 100.0 Z",
  "M569.0 0.0 L549.4 0.0 L513.0 100.0 L532.5 100.0 Z",
];

export const AetherFlixWordmark = ({ style }) => (
  <svg
    viewBox="0 0 569 100"
    fill="currentColor"
    role="img"
    aria-label="AetherFlix"
    style={{ height: "1em", width: "auto", display: "block", ...style }}
  >
    {WORDMARK_PATHS.map((d) => (
      <path key={d} fillRule="evenodd" d={d} />
    ))}
  </svg>
);

export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
export const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 8v4l3 3" />
    <path d="M3.05 11a9 9 0 1 1 .5 4" />
    <path d="M3 3v5h5" />
  </svg>
);
export const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
export const BookmarkFillIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
export const FilmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="17" y1="7" x2="22" y2="7" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="2" y1="17" x2="7" y2="17" />
  </svg>
);
export const TVIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
);
export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
export const StarIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const HelpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ width: 24, height: 24 }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
export const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const WatchedIcon = ({ size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    style={{ filter: "drop-shadow(0 0 4px rgba(72,199,116,0.7))" }}
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      fill="#1a2e1a"
      stroke="#48c774"
      strokeWidth="1.5"
    />
    <path
      d="M6.5 12.5l3.5 3.5 7-7"
      stroke="#48c774"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrailerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </svg>
);

export const DownloadsQueueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
);

export const QuitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const RatingShieldIcon = ({ size = 10 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);

export const RatingLockIcon = ({ size = 10 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const SourceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="12" rx="10" ry="10" />
    <ellipse cx="12" cy="12" rx="4" ry="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export const WarningIcon = ({ size = 24, color = "var(--red)" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ExternalLinkIcon = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const ShieldBlockIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

export const SubtitlesIcon = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
  </svg>
);

export const PopOutIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="13" height="10" rx="2" />
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
  </svg>
);

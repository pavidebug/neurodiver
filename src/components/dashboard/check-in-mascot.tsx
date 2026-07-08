/** Friendly blob mascot for the check-in hero card */
export function CheckInMascot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="155" rx="70" ry="12" fill="#2D5A3D" fillOpacity="0.08" />
      <path
        d="M55 95 C55 55 145 55 145 95 C145 130 125 145 100 145 C75 145 55 130 55 95Z"
        fill="#5A9B6E"
      />
      <path
        d="M62 98 C62 62 138 62 138 98 C138 125 122 138 100 138 C78 138 62 125 62 98Z"
        fill="#6DB080"
      />
      <circle cx="82" cy="88" r="5" fill="#2D5A3D" fillOpacity="0.7" />
      <circle cx="118" cy="88" r="5" fill="#2D5A3D" fillOpacity="0.7" />
      <path
        d="M88 102 Q100 112 112 102"
        stroke="#2D5A3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M78 108 C85 118 115 118 122 108"
        stroke="#2D5A3D"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <ellipse cx="72" cy="95" rx="8" ry="5" fill="#FAF0C8" fillOpacity="0.35" />
      <ellipse cx="128" cy="95" rx="8" ry="5" fill="#FAF0C8" fillOpacity="0.35" />
      <path
        d="M45 110 C35 125 40 140 55 135"
        stroke="#5A9B6E"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M155 110 C165 125 160 140 145 135"
        stroke="#5A9B6E"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M130 55 Q145 35 160 50"
        stroke="#8BC49A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <ellipse cx="165" cy="48" rx="10" ry="6" fill="#A8D4B4" fillOpacity="0.6" />
    </svg>
  )
}

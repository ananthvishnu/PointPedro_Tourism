
import React from "react";
import "./SrilankaMap.css";

const places = [
  { name: "Point Pedro Lighthouse", x: 300, y: 180 },
  { name: "Point Pedro Jetty", x: 265, y: 215 },
  { name: "Sakkotai Cape", x: 220, y: 145 },
  { name: "Vallipura Alwar Temple", x: 350, y: 300 },
  { name: "Manalkadu Sand Dunes", x: 380, y: 355 },
  { name: "Selva Sannithy Temple", x: 230, y: 395 },
];

export default function SrilankaMap() {
  return (
    <section className="pp-illustration">
      <div className="pp-illustration-heading">
        <span className="pp-illustration-eyebrow">
          EXPLORE JAFFNA PENINSULA
        </span>
        <h2>Discover Point Pedro</h2>
        <p>
          Where golden sands meet the turquoise waters
          of Sri Lanka's northern coast.
        </p>
      </div>

      <div className="pp-illustration-card">
        <svg
          viewBox="0 0 500 540"
          className="pp-illustration-svg"
          role="img"
          aria-labelledby="pp-map-title pp-map-desc"
        >
          <title id="pp-map-title">
            Point Pedro tourist illustration map
          </title>
          <desc id="pp-map-desc">
            A decorative map of the Point Pedro coastal
            region highlighting tourist attractions.
          </desc>

          <defs>
            <linearGradient id="pp-ocean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D8F4F1" />
              <stop offset="100%" stopColor="#91D8D9" />
            </linearGradient>

            <linearGradient id="pp-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF5D9" />
              <stop offset="100%" stopColor="#E7D5A8" />
            </linearGradient>

            <filter id="pp-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="5"
                floodColor="#164E63"
                floodOpacity="0.13"
              />
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="500" height="540" rx="22" fill="url(#pp-ocean)" />

          {/* Decorative ocean waves */}
          {[70, 110, 440, 480].map((y, i) => (
            <g key={i} opacity="0.5" fill="none" stroke="#FFFFFF">
              <path
                d={`M 10 ${y} Q 40 ${y - 12} 70 ${y} T 130 ${y}`}
                strokeWidth="2"
              />
              <path
                d={`M 375 ${y} Q 405 ${y - 12} 435 ${y} T 495 ${y}`}
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Stylized northern coastline */}
          <path
            d="
              M 125 65
              L 165 48
              L 205 56
              L 232 78
              L 260 82
              L 278 104
              L 305 113
              L 326 133
              L 350 143
              L 374 168
              L 389 193
              L 383 216
              L 399 240
              L 390 263
              L 402 287
              L 389 312
              L 396 338
              L 380 364
              L 366 393
              L 341 417
              L 316 437
              L 286 451
              L 250 445
              L 221 426
              L 202 401
              L 185 372
              L 166 346
              L 151 318
              L 132 290
              L 121 261
              L 111 230
              L 104 197
              L 109 165
              L 115 132
              Z
            "
            fill="url(#pp-land)"
            stroke="#B9A779"
            strokeWidth="2"
            filter="url(#pp-shadow)"
          />

          {/* Coastal sand areas */}
          <path
            d="M 115 165 Q 150 135 190 150 T 270 135"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />

          <path
            d="M 375 220 Q 360 250 383 275 T 372 330"
            fill="none"
            stroke="#F5D38A"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Palm trees */}
          {[
            [155, 220],
            [355, 185],
            [345, 365],
            [225, 375],
            [285, 410],
          ].map(([x, y], i) => (
            <g
              key={i}
              transform={`translate(${x} ${y})`}
              stroke="#287D65"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M0 12 L2 -8" />
              <path d="M2 -8 Q-10 -17 -14 -10 Q-5 -9 2 -8" />
              <path d="M2 -8 Q8 -20 16 -15 Q11 -9 2 -8" />
              <path d="M2 -8 Q-1 -23 5 -25 Q8 -15 2 -8" />
              <path d="M2 -8 Q15 -6 17 1 Q8 0 2 -8" />
              <path d="M2 -8 Q-13 -3 -15 3 Q-5 2 2 -8" />
            </g>
          ))}

          {/* Lighthouse illustration */}
          <g transform="translate(300 155)" filter="url(#pp-shadow)">
            <ellipse cx="0" cy="31" rx="24" ry="6" fill="#B9A779" />
            <path
              d="M-13 27 L-8 -7 L8 -7 L13 27 Z"
              fill="#FFFFFF"
              stroke="#47777A"
              strokeWidth="1.5"
            />
            <path d="M-11 8 L11 8 L9 17 L-10 17 Z" fill="#E76F51" />
            <path d="M-8 -7 L-9 -17 L9 -17 L8 -7 Z" fill="#D8E8E5" />
            <rect x="-7" y="-23" width="14" height="6" rx="1" fill="#E76F51" />
            <path d="M-12 -23 L0 -31 L12 -23 Z" fill="#245B5B" />
            <path
              d="M-3 -28 L-3 -34 L3 -34 L3 -28"
              fill="#FFFFFF"
            />
          </g>

          {/* Main Point Pedro marker */}
          <circle cx="300" cy="180" r="19" fill="#0D9488" opacity="0.18">
            <animate
              attributeName="r"
              values="14;25;14"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="300" cy="180" r="7" fill="#0D9488" stroke="#FFFFFF" strokeWidth="3" />

          {/* Jetty */}
          <g transform="translate(260 218)" stroke="#956F43" strokeWidth="4">
            <path d="M0 0 L32 -6 L46 -17" fill="none" strokeLinecap="round" />
            <path d="M8 -2 L10 5 M22 -5 L24 2 M35 -10 L37 -3" />
          </g>

          {/* Attraction markers and labels */}
          {places.map((place, i) => (
            <g key={place.name}>
              {i !== 0 && (
                <circle
                  cx={place.x}
                  cy={place.y}
                  r="5"
                  fill="#0F766E"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </g>
          ))}

          {/* Main location label */}
          <g transform="translate(315 130)">
            <rect width="145" height="43" rx="9" fill="#FFFFFF" opacity="0.96" />
            <text
              x="10"
              y="18"
              fill="#075E54"
              fontSize="12"
              fontWeight="700"
            >
              POINT PEDRO
            </text>
            <text x="10" y="32" fill="#537875" fontSize="9">
              Northernmost Sri Lanka
            </text>
          </g>

          {/* Secondary labels */}
          <g fontSize="10" fill="#65583F" fontWeight="600">
            <text x="210" y="238">Jetty</text>
            <text x="355" y="306">Vallipura Alwar</text>
            <text x="355" y="318">Temple</text>
            <text x="315" y="390">Manalkadu Dunes</text>
            <text x="130" y="405">Selva Sannithy</text>
            <text x="130" y="417">Temple</text>
            <text x="155" y="130">Sakkotai Cape</text>
          </g>

          {/* Compass */}
          <g transform="translate(440 460)">
            <circle r="22" fill="#FFFFFF" opacity="0.8" />
            <path d="M0 -15 L6 5 L0 1 L-6 5 Z" fill="#0F766E" />
            <text x="0" y="-25" textAnchor="middle" fontSize="10" fill="#075E54" fontWeight="700">
              N
            </text>
          </g>

          {/* Map caption */}
          <g transform="translate(18 480)">
            <rect width="275" height="40" rx="10" fill="#FFFFFF" opacity="0.92" />
            <circle cx="18" cy="20" r="5" fill="#0D9488" />
            <text x="31" y="17" fill="#075E54" fontSize="10" fontWeight="700">
              EXPLORE THE NORTHERN COAST
            </text>
            <text x="31" y="30" fill="#537875" fontSize="9">
              Beaches • Heritage • Temples
            </text>
          </g>
        </svg>
      </div>

      <div className="pp-illustration-footer">
        <span>🌊 Turquoise Coast</span>
        <span>🌴 Palmyrah Country</span>
        <span>📍 Point Pedro, Jaffna</span>
      </div>
    </section>
  );
}

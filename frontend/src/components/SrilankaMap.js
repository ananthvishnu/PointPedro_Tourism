import React from 'react';
import './SriLankaMap.css';

export default function SriLankaMap() {
  return (
    <div className="srilanka-map-container">
      <svg viewBox="0 0 500 700" xmlns="http://www.w3.org/2000/svg" className="srilanka-map-svg">
        <title>Sri Lanka map with Batticaloa district highlighted</title>

        {/* Background ocean */}
        <ellipse cx="250" cy="380" rx="200" ry="310" fill="#E6F1FB" opacity="0.3"/>

        {/* Northern Province */}
        <path d="M245,80 L260,75 L275,80 L285,90 L290,105 L295,120 L285,130 L275,125 L265,130 L255,125 L245,130 L235,125 L225,130 L220,120 L215,105 L220,90 L230,82 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>
        <path d="M230,80 L245,72 L260,70 L270,75 L265,80 L250,78 L235,82 Z"
          fill="#B4B2A9" stroke="#888780" strokeWidth="0.5"/>

        {/* North Central Province */}
        <path d="M220,130 L295,130 L300,150 L305,170 L300,190 L295,195 L275,200 L255,200 L240,195 L225,190 L215,170 L215,150 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* North Western Province */}
        <path d="M215,150 L215,190 L210,210 L205,230 L200,245 L195,255 L190,265 L195,270 L205,265 L215,260 L220,250 L225,235 L225,210 L225,190 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* Western Province */}
        <path d="M190,265 L195,270 L200,280 L205,295 L208,310 L205,320 L200,325 L193,318 L188,305 L185,290 L185,275 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* Southern Province */}
        <path d="M193,318 L200,325 L208,335 L215,345 L225,355 L235,362 L245,368 L255,370 L265,368 L275,362 L283,352 L288,340 L290,328 L285,320 L278,315 L270,318 L260,320 L250,318 L240,315 L230,315 L220,316 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* Uva Province */}
        <path d="M270,240 L295,235 L310,240 L315,255 L315,270 L310,285 L300,295 L290,300 L280,298 L270,290 L265,278 L265,263 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* Central Province (Hill country - green) */}
        <path d="M225,235 L240,228 L255,225 L270,228 L280,235 L285,248 L285,260 L280,270 L270,275 L258,278 L245,275 L235,268 L228,255 L225,243 Z"
          fill="#C0DD97" stroke="#97C459" strokeWidth="1" opacity="0.8"/>

        {/* Sabaragamuwa Province */}
        <path d="M215,260 L225,255 L235,260 L245,265 L250,278 L248,290 L240,298 L228,298 L218,290 L212,278 L212,268 Z"
          fill="#D3D1C7" stroke="#B4B2A9" strokeWidth="1"/>

        {/* Eastern Province */}
        <path d="M295,130 L310,135 L325,145 L335,158 L340,175 L338,195 L332,215 L325,230 L318,245 L315,255 L315,270 L310,285 L305,300 L298,312 L290,320 L285,320 L288,305 L290,290 L290,275 L285,260 L285,248 L285,235 L295,235 L300,220 L300,200 L295,195 L300,180 L300,165 L295,150 Z"
          fill="#9FE1CB" stroke="#1D9E75" strokeWidth="1.5"/>

        {/* Batticaloa District - highlighted */}
        <path d="M305,210 L315,205 L328,210 L335,222 L335,238 L328,250 L320,258 L312,260 L305,255 L300,245 L298,232 L300,220 Z"
          fill="#1D9E75" stroke="#0F6E56" strokeWidth="2" opacity="0.9" className="batticaloa-district"/>

        {/* Batticaloa center dot */}
        <circle cx="317" cy="233" r="5" fill="#ffffff" stroke="#0F6E56" strokeWidth="1.5"/>
        <circle cx="317" cy="233" r="2.5" fill="#0F6E56"/>

        {/* Pulsing ring animation */}
        <circle cx="317" cy="233" r="5" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.8">
          <animate attributeName="r" from="5" to="18" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
        </circle>

        {/* Arrow to Batticaloa */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#1D9E75"/>
          </marker>
        </defs>
        <line x1="370" y1="195" x2="328" y2="228" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arrow)"/>

        {/* Batticaloa label box */}
        <rect x="355" y="168" width="115" height="50" rx="6" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/>
        <text x="412" y="186" textAnchor="middle" fontSize="13" fontWeight="500" fill="#085041" fontFamily="sans-serif">Batticaloa</text>
        <text x="412" y="202" textAnchor="middle" fontSize="11" fill="#0F6E56" fontFamily="sans-serif">Eastern Province</text>
        <text x="412" y="214" textAnchor="middle" fontSize="10" fill="#1D9E75" fontFamily="sans-serif">7.717°N, 81.700°E</text>

        {/* City dots */}
        <circle cx="193" cy="295" r="4" fill="#534AB7" stroke="#ffffff" strokeWidth="1"/>
        <text x="175" y="292" textAnchor="middle" fontSize="9" fill="#3C3489" fontFamily="sans-serif">Colombo</text>

        <circle cx="248" cy="258" r="3" fill="#534AB7" stroke="#ffffff" strokeWidth="1"/>
        <text x="237" y="255" textAnchor="middle" fontSize="9" fill="#3C3489" fontFamily="sans-serif">Kandy</text>

        <circle cx="248" cy="76" r="3" fill="#534AB7" stroke="#ffffff" strokeWidth="1"/>
        <text x="248" y="70" textAnchor="middle" fontSize="9" fill="#3C3489" fontFamily="sans-serif">Jaffna</text>

        <circle cx="308" cy="165" r="3" fill="#534AB7" stroke="#ffffff" strokeWidth="1"/>
        <text x="330" y="162" fontSize="9" fill="#3C3489" fontFamily="sans-serif">Trincomalee</text>

        <circle cx="222" cy="358" r="3" fill="#534AB7" stroke="#ffffff" strokeWidth="1"/>
        <text x="200" y="368" fontSize="9" fill="#3C3489" fontFamily="sans-serif">Galle</text>

        {/* Legend */}
        <rect x="20" y="590" width="200" height="90" rx="6" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="0.5"/>
        <text x="30" y="610" fontSize="11" fontWeight="500" fill="#2C2C2A" fontFamily="sans-serif">Legend</text>
        <rect x="30" y="620" width="12" height="12" rx="2" fill="#1D9E75"/>
        <text x="48" y="631" fontSize="10" fill="#5F5E5A" fontFamily="sans-serif">Batticaloa District</text>
        <rect x="30" y="640" width="12" height="12" rx="2" fill="#9FE1CB"/>
        <text x="48" y="651" fontSize="10" fill="#5F5E5A" fontFamily="sans-serif">Eastern Province</text>
        <rect x="30" y="660" width="12" height="12" rx="2" fill="#C0DD97"/>
        <text x="48" y="671" fontSize="10" fill="#5F5E5A" fontFamily="sans-serif">Central Province</text>
        <rect x="30" y="680" width="12" height="12" rx="2" fill="#D3D1C7"/>
        <text x="48" y="691" fontSize="10" fill="#5F5E5A" fontFamily="sans-serif">Other provinces</text>

        {/* Title */}
        <text x="250" y="30" textAnchor="middle" fontSize="18" fontWeight="500" fill="#1D9E75" fontFamily="sans-serif">Sri Lanka</text>
        <text x="250" y="50" textAnchor="middle" fontSize="12" fill="#888780" fontFamily="sans-serif">Eastern Province — Batticaloa District</text>
      </svg>
    </div>
  );
}

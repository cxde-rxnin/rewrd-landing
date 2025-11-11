import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Simplified world map coordinates (continents outline)

export const WorldMap = ({
  dots = [],
  lineColor = "#8b5cf6",
}: {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const width = svgRef.current.parentElement.clientWidth;
        const height = svgRef.current.parentElement.clientHeight;
        setDimensions({ width: width || 1200, height: height || 600 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const createCurvedPath = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ) => {
    const startX = ((start.lng + 180) * dimensions.width) / 360;
    const startY = ((90 - start.lat) * dimensions.height) / 180;
    const endX = ((end.lng + 180) * dimensions.width) / 360;
    const endY = ((90 - end.lat) * dimensions.height) / 180;

    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 50;

    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  };

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="50%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* World Map Continents */}
        <g className="continents">
          {/* North America */}
          <motion.path
            d="M 150,120 Q 180,100 220,110 L 280,130 Q 300,150 280,180 L 240,200 Q 200,210 170,190 L 140,160 Q 130,140 150,120 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0 }}
          />
          
          {/* South America */}
          <motion.path
            d="M 220,240 L 250,260 Q 260,290 250,320 L 230,360 Q 210,380 190,370 L 180,340 Q 175,310 185,280 L 200,250 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2 }}
          />
          
          {/* Europe */}
          <motion.path
            d="M 480,100 L 520,95 Q 550,100 570,120 L 580,140 Q 575,160 560,170 L 520,175 Q 490,170 470,150 L 465,120 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
          />
          
          {/* Africa */}
          <motion.path
            d="M 520,180 L 560,190 Q 590,210 600,240 L 605,290 Q 600,330 580,360 L 540,375 Q 510,370 490,350 L 475,310 Q 470,270 480,230 L 500,200 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6 }}
          />
          
          {/* Asia */}
          <motion.path
            d="M 600,100 L 700,90 Q 800,95 880,120 L 940,150 Q 950,180 940,210 L 900,240 Q 850,250 800,245 L 720,235 Q 660,220 620,190 L 590,160 Q 585,130 600,100 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
          />
          
          {/* Australia */}
          <motion.path
            d="M 850,320 L 920,315 Q 960,330 980,360 L 985,390 Q 975,415 950,425 L 890,430 Q 850,420 830,390 L 825,355 Z"
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </g>

        {/* Decorative dots on continents */}
        <g className="map-dots">
          {Array.from({ length: 80 }).map((_, i) => {
            // Position dots to roughly follow continent shapes
            const regions = [
              { x: [150, 280], y: [120, 200] }, // North America
              { x: [180, 250], y: [240, 380] }, // South America
              { x: [465, 580], y: [95, 175] },  // Europe
              { x: [475, 605], y: [180, 375] }, // Africa
              { x: [590, 950], y: [90, 250] },  // Asia
              { x: [825, 985], y: [315, 430] }, // Australia
            ];
            
            const region = regions[i % regions.length];
            const x = region.x[0] + Math.random() * (region.x[1] - region.x[0]);
            const y = region.y[0] + Math.random() * (region.y[1] - region.y[0]);
            
            return (
              <motion.circle
                key={`dot-${i}`}
                cx={x}
                cy={y}
                r="1.5"
                fill={lineColor}
                opacity="0.4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </g>

        {/* Connection Lines */}
        {dots.map((dot, index) => (
          <g key={`connection-${index}`}>
            <motion.path
              d={createCurvedPath(dot.start, dot.end)}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            {/* Start Point */}
            <motion.circle
              cx={((dot.start.lng + 180) * dimensions.width) / 360}
              cy={((90 - dot.start.lat) * dimensions.height) / 180}
              r="4"
              fill={lineColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
              transition={{
                duration: 0.5,
                delay: index * 0.3,
              }}
            />
            {/* End Point */}
            <motion.circle
              cx={((dot.end.lng + 180) * dimensions.width) / 360}
              cy={((90 - dot.end.lat) * dimensions.height) / 180}
              r="4"
              fill={lineColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
              transition={{
                duration: 0.5,
                delay: index * 0.3 + 0.5,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

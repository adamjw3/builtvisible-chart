import React from 'react';
import { motion } from 'framer-motion';

interface CircleProps {
  diameter?: number;
  fillColor?: string;
  maskedSide?: 'left' | 'right';
  className?: string;
  clipPathName?: string;
  style?: React.CSSProperties;
}

const Circle: React.FC<CircleProps> = ({
  diameter = 87,
  fillColor = '#8F00FF',
  maskedSide = 'right',
  className = '',
  clipPathName,
  style = {}
}) => {
  const uniqueClipPathName = React.useMemo(
    () => clipPathName || `clip-${Math.random().toString(36).substr(2, 9)}`,
    [clipPathName]
  );

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      className={`responsive-circle ${className}`}
      style={{ ...style, transformOrigin: '50% 50%' }}
      animate={{ width: diameter, height: diameter }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      <defs>
        <clipPath id={uniqueClipPathName}>
          {maskedSide === 'right' ? (
            <rect x="0" y="0" width="50%" height="100%" />
          ) : (
            <rect x="50%" y="0" width="50%" height="100%" />
          )}
        </clipPath>
      </defs>
      <circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={diameter / 2}
        fill={fillColor}
        clipPath={`url(#${uniqueClipPathName})`}
      />
    </motion.svg>
  );
};

export default Circle;

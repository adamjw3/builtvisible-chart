import React from 'react';

interface CircleProps {
  diameter?: number;
  fillColor?: string;
  maskedSide?: 'left' | 'right';
  className?: string;
  clipPathName: string;
}

const Circle: React.FC<CircleProps> = ({
  diameter = 87,
  fillColor = '#8F00FF',
  maskedSide = 'right',
  className = '',
  clipPathName
}) => {
  const radius = Math.min(diameter / 2, 45);
  const viewBoxSize = Math.min(diameter * 2, 280);
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={`responsive-circle ${className}`}
    >
      <defs>
        <clipPath id={clipPathName}>
          {maskedSide === 'right' ? (
            <rect x="0" y="0" width="50%" height={viewBoxSize} />
          ) : (
            <rect x="50%" y="0" width="50%" height={viewBoxSize} />
          )}
        </clipPath>
      </defs>
      <circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill={fillColor}
        clipPath={`url(#${clipPathName})`}
      />
    </svg>
  );
};

export default Circle;
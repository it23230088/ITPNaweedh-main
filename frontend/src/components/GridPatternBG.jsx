import React from 'react';
import PropTypes from 'prop-types';

const GridPatternBG = ({ 
  width = 40, 
  height = 40, 
  x = -1,
  y = -1,
  strokeDasharray = 0,
  className = '',
  strokeColor = 'rgba(128, 128, 128, 0.3)',
  ...props
}) => {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M${width} 0H0V${height}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

GridPatternBG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  strokeDasharray: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  strokeColor: PropTypes.string
};

export default GridPatternBG;
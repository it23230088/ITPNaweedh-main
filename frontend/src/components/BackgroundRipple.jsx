import React from "react";
import PropTypes from 'prop-types';

const BackgroundRipple = ({ mainCircleSize = 210, mainCircleOpacity = 0.24, numCircles = 15, className = "" }) => {
  return (
    <div
      className={`absolute inset-0 bg-[#D4F1F4] [mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 100;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;
        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle,
              borderWidth: "1px",
              borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
};

BackgroundRipple.propTypes = {
  mainCircleSize: PropTypes.number,
  mainCircleOpacity: PropTypes.number,
  numCircles: PropTypes.number,
  className: PropTypes.string
};

export default React.memo(BackgroundRipple);
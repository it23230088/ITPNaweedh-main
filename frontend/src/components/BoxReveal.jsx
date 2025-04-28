import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, useAnimation, useInView } from "framer-motion";

const BoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#5046e6",
  duration = 0.5,
}) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration, ease: "easeIn" }}
        className="absolute inset-y-1 left-0 right-0 z-20"
        style={{ background: boxColor }}
      />
    </div>
  );
};

BoxReveal.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOf(["fit-content", "100%"]),
  boxColor: PropTypes.string,
  duration: PropTypes.number,
};

export default BoxReveal;

import { Info } from "lucide-react";
import React, { useState, useEffect } from "react";

const InfoButton = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure the component is mounted before rendering dynamic content
  }, []);

  const showTooltip = () => {
    if (isMounted) setIsVisible(true);
  };

  const hideTooltip = () => {
    if (isMounted) setIsVisible(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </button>
      {isMounted && isVisible && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1,
            width: "200px",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default InfoButton;

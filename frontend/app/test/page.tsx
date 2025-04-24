"use client";

import React, { useEffect, useRef, useState } from "react";

const generateDummyData = (start, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    text: `Item ${start + i}`,
  }));
};

const InfiniteScroll = () => {
  const [items, setItems] = useState(() => generateDummyData(1, 20));
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Function to load more items
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateDummyData(prev.length + 1, 20)]);
      setLoading(false);
    }, 1000); // simulate network delay
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      console.log("scrollTop", scrollTop);
      console.log("scrollHeight", scrollHeight);
      console.log("clientHeight", clientHeight);

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "90vh",
        overflowY: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
      }}
      className="sm:p-4 sm:border sm:rounded-md"
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "10px",
            margin: "10px 0",
            backgroundColor: "#f2f2f2",
            borderRadius: "5px",
          }}
          className="sm:py-2 sm:px-3 sm:mb-2"
        >
          {item.text}
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "20px" }}>
        {loading ? "Loading more..." : "Scroll to load more"}
      </div>
    </div>
  );
};

export default InfiniteScroll;

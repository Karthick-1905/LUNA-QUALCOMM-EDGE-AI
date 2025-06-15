import React from "react";

export default function Skeleton({ className = "", style = {}, ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ minHeight: 24, ...style }}
      {...props}
    />
  );
}

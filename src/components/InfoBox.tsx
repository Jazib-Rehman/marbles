"use client";

import React from "react";

interface InfoBoxProps {
  title: string;
  content: string[];
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content }) => {
  return (
    <div className="border-2 border-purple-500 rounded-lg p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-700 mb-6">
        {title}
      </h2>
      <div className="text-purple-700 space-y-4 text-sm md:text-base">
        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default InfoBox;

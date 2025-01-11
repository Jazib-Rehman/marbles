import Link from "next/link";
import React from "react";

interface ServiceCardProps {
  iconSrc: string;
  title1: string;
  subtitle1: string;
  title2: string;
  subtitle2: string;
  buttonText: string;
  footerText: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  iconSrc,
  title1,
  subtitle1,
  title2,
  subtitle2,
  buttonText,
  footerText,
}) => {
  return (
    <div
      style={{
        boxShadow: "0 0 8px 0 #5006A6",
      }}
      className="max-w-sm mx-auto p-6 bg-white rounded-2xl border border-gray-200"
    >
      {/* Icon Section */}
      <div className="flex justify-center mb-6">
        <img
          src={iconSrc}
          alt="Service Icon"
          className="h-24 w-24 text-primary"
        />
      </div>

      {/* Title Section */}
      <div className="text-center">
        <h2 className="text-primary font-semibold text-xl mb-2">{title1}</h2>
        <p style={{ fontWeight: "500" }} className="text-primary mb-4">
          -&gt; <i>{subtitle1}</i>{" "}
        </p>

        <h2 className="text-primary font-semibold text-xl mb-2">{title2}</h2>
        <p style={{ fontWeight: "500" }} className="text-primary mb-4">
          -&gt; <i>{subtitle2}</i>{" "}
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-center mb-4">
        <Link
          href="/find-it-and-tech-talents"
          className="bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-3 rounded-full shadow hover:from-purple-700 hover:to-blue-600 transition-colors"
        >
          {buttonText}
        </Link>
      </div>

      {/* Footer Text */}
      <div className="text-center text-purple-600 font-medium">
        <p>
          <i>{footerText}</i>
        </p>
      </div>
    </div>
  );
};

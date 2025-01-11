import React from "react";
import Image from "next/image";
import Link from "next/link";

const marbles = [
  {
    name: "Sunny gray",
    img: "/stones/sunnygray.webp",
    description: '6"x12", 4"x12", 6"x6"',
  },
  {
    name: "Sunny white",
    img: "/stones/sunnywhite.jpg",
    description: '6"x12", 4"x12", 6"x6"',
  },
  // Add other marbles here...
];

export default function WhatWeOffer(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <div className="text-[#FF914D] text-4xl">—</div>
              <span className="text-[#FF914D] text-2xl ml-3">What We Offer</span>
            </div>
            <h2 className="text-5xl mt-4">Provides Best Marbles</h2>
          </div>
          <Link
            href="/showroom"
            className="bg-[#FF914D] hover:bg-[#b16f46] text-white px-6 py-2"
          >
            Visit Showroom →
          </Link>
        </div>
        <div className="h-px w-full bg-[#FF914D] my-8" />
        <div className="grid grid-cols-4 gap-6">
          {marbles.map((marble, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src={marble.img}
                alt={marble.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{marble.name}</h3>
                {marble.description && (
                  <p className="text-gray-600 mt-2">{marble.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
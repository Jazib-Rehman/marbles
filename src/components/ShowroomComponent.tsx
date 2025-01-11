import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ShowroomComponent(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black py-20">
      <div className="w-full max-w-7xl flex gap-12 px-6">
        <div className="w-5/12">
          <Image
            src="/room.jpg"
            alt="Showroom"
            width={500}
            height={600}
            className="w-full object-cover"
          />
        </div>
        <div className="w-7/12">
          <div className="flex items-center">
            <div className="text-[#FF914D] text-4xl">—</div>
            <span className="text-[#FF914D] text-2xl ml-3">Showroom</span>
          </div>
          <h2 className="text-white text-5xl mt-4">
            Visit Our Marble & Granite Display Warehouse
          </h2>
          <p className="mt-5 text-gray-300 text-lg">
            Discover a vast selection of premium marble and granite at our display
            warehouse. Explore an extensive range of colors, patterns, and
            finishes, ideal for all your residential and commercial projects.
          </p>
          <div className="mt-10">
            <div className="flex items-center">
              <div className="text-[#FF914D] text-4xl">—</div>
              <span className="text-[#FF914D] text-2xl ml-3">
                Choose Your Stone
              </span>
            </div>
            <h3 className="text-white text-3xl mt-2">
              Showroom With 200+ Selections
            </h3>
            <Link
              href="/showroom"
              className="inline-block mt-4 bg-[#FF914D] hover:bg-[#b16f46] text-white px-6 py-2"
            >
              Visit →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
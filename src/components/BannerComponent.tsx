import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BannerComponent(): React.JSX.Element {
  return (
    <div className="w-full h-[70vh] flex">
      <div className="w-2/3 h-full relative">
        <Image
          src="/banner.jpg"
          alt="Jehangira marble banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70 pt-40 flex flex-col items-center">
          <div className="flex items-center">
            <div className="text-[#FF914D] text-4xl">—</div>
            <span className="text-white text-2xl ml-3">
              Welcome to Jehangira Marble
            </span>
          </div>
          <h1 className="text-white text-5xl mt-10">Best Stone Suppliers</h1>
          <h2 className="text-white text-5xl mt-5">Tiles Slabs Pavers</h2>
          <div className="mt-10 flex items-center">
            <span className="text-white text-xl">Visit Showroom</span>
            <Link 
              href="/showroom"
              className="ml-5 bg-[#FF914D] hover:bg-[#b16f46] text-white px-6 py-2 flex items-center"
            >
              Visit
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/3 h-full bg-[#FF914D] relative">
        <div className="absolute -left-24 top-16">
          <Image
            src="/slab.jpg"
            alt="Marble slab"
            width={450}
            height={550}
            className="object-cover"
          />
        </div>
        <div className="absolute left-24 top-24">
          <Image
            src="/design.jpg"
            alt="Marble design"
            width={350}
            height={450}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
} 
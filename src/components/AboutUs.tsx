import React from "react";
import Image from "next/image";

export default function AboutUs(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20">
      <div className="w-full max-w-7xl flex gap-12 px-6">
        <div className="w-2/3">
          <div className="flex items-center">
            <div className="text-[#FF914D] text-4xl">—</div>
            <span className="text-[#FF914D] text-2xl ml-3">About Us</span>
          </div>
          <h2 className="text-5xl mt-4">Welcome to Jehangira Marble!</h2>
          <p className="mt-5 text-gray-700 text-lg">
            With over 25 years of experience in the marble industry, we take pride
            in providing high-quality marble products to our valued customers. At
            Jehangira Marble, we offer a wide variety of marbles to suit all your
            needs, whether for residential or commercial projects.
          </p>
          <p className="mt-5 text-gray-700 text-lg">
            We also provide products at wholesale rates to marble showrooms and
            large businesses, ensuring that you receive the best value for your
            investment. Trust us to deliver exceptional service and superior
            products every time.
          </p>
        </div>
        <div className="w-1/3">
          <Image
            src="/aboutus.jpg"
            alt="About Jehangira marble"
            width={400}
            height={500}
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
} 
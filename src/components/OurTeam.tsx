import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Maqbool Ur Rehman",
    img: "/dad.jpg",
    designation: "Founder",
    introduction:
      "Maqbool Ur Rehman, the founder, is a retired teacher with over 25 years of rich experience in the marble industry...",
  },
  {
    name: "Jazib Ur Rehman",
    img: "/jazib.jpg",
    designation: "Technical Officer",
  },
  {
    name: "Saim Ur Rehman",
    img: "/saim.jpg",
    designation: "Chief Manager",
  },
];

export default function OurTeam(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full bg-black py-32">
      <div className="max-w-7xl mx-auto px-6 flex gap-12">
        <div className="w-5/12 sticky top-32">
          <div className="flex items-center">
            <div className="text-[#FF914D] text-4xl">—</div>
            <span className="text-[#FF914D] text-2xl ml-3">Our Executive Team</span>
          </div>
          <h2 className="text-white text-5xl mt-4">
            Leading with Expertise and Dedication
          </h2>
          <p className="text-gray-300 mt-5">
            At the heart of our marble selling business is a team of dedicated
            leaders who bring a wealth of experience and a shared commitment to
            excellence...
          </p>
        </div>
        <div className="w-7/12">
          <div className="grid grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover rounded"
                />
                <h3 className="text-white text-xl font-semibold mt-4">
                  {member.name}
                </h3>
                <p className="text-[#FF914D] mt-1">{member.designation}</p>
                {member.introduction && (
                  <p className="text-gray-400 mt-2 text-sm">{member.introduction}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
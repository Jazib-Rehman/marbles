"use client";

import HardToFill from "@/components/HardToFill";
import ITRecruitmentSection from "@/components/ITRecruitmentSection";
import Link from "next/link";
import React, { useState } from "react";

export default function ForClientsPage() {
  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);

  const openModal = () => setIsTalentModalOpen(true);
  const closeModal = () => setIsTalentModalOpen(false);

  return (
    <div className="flex justify-center w-full">
      <div
        style={{
          maxWidth: "1200px",
        }}
        className="w-full h-full mt-12 px-4 md:px-0"
      >
        <ITRecruitmentSection />
        <div>
          <div className="flex flex-col items-center space-y-8 py-12 px-6 bg-white">
            {/* Section 1 */}
            <div className="flex justify-evenly w-full text-center">
              <h3 className="text-xl md:text-3xl font-semibold text-blue-800 mb-4">
                Narrow Search, Browse Profiles, Select, Interview and Hire
              </h3>
              <Link href={"/find-it-and-tech-talents"}>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition duration-300">
                  Search and Hire
                </button>
              </Link>
            </div>

            {/* Section 2 */}
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4">
                Let's collaborate on your hard-to-fill positions
              </h3>
              <button
                onClick={openModal}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition duration-300"
              >
                Send us your open roles
              </button>
            </div>

            {/* Section 3 */}
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4">
                Find out more about our IT Recruiter Division and the
                recruitment services we offer
              </h3>
              <Link target="_blank" href={"https://it-recruiter.eu/"}>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition duration-300">
                  IT Recruitment Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <HardToFill isOpen={isTalentModalOpen} onClose={closeModal} />
    </div>
  );
}

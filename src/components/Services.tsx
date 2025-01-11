import React from "react";
import { ServiceCard } from "./ServiceCard";

export const Services: React.FC = () => {
  return (
    <div>
      <div className="text-center mt-10 px-4">
        <div className="">
          <h1 className="text-primary text-3xl md:text-5xl">
            Hire or Lease and Collaborate
          </h1>
          <h2 className="text-primary text-lg md:text-3xl">
            remote, hybrid or on-site with
          </h2>
        </div>

        {/* Added spacing below the h2 */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-6 md:gap-10 items-center min-h-screen">
          <div className="w-72">
            <ServiceCard
              iconSrc="/icons/talent.png"
              title1="IT and Tech Talents"
              subtitle1="Seeking full-time employment"
              title2="(B2B) IT Contractors and Freelancers"
              subtitle2="for short- or long-time projects"
              buttonText="Search and Select"
              footerText="Flat rate per successful hire, special pricing by multiple hires"
            />
          </div>
          <div className="w-72">
            <ServiceCard
              iconSrc="/icons/team.png"
              title1="Ready-made IT and Tech Teams"
              subtitle1="Seeking full-time employment"
              title2="(B2B) IT Contractors and Freelancers"
              subtitle2="for short- or long-time projects"
              buttonText="Search and Select"
              footerText="Flat rate per successful hire, special pricing by multiple hires"
            />
          </div>
          <div className="w-72">
            <ServiceCard
              iconSrc="/icons/agency.png"
              title1="IT and Tech Talents"
              subtitle1="Seeking full-time employment"
              title2="(B2B) IT Contractors and Freelancers"
              subtitle2="for short- or long-time projects"
              buttonText="Search and Select"
              footerText="Flat rate per successful hire, special pricing by multiple hires"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

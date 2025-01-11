"use client";

import React, { useState } from "react";
interface FAQItem {
  title: string;
  content: string;
}

const faqItems: FAQItem[] = [
  {
    title: "For Employers",
    content: `1. No need to register! Search and select pre-vetted available IT / Tech Talents or ready-made small Teams, based in Europe, Latin America, in the USA, Canada, Singapore or in Hong Kong. If you wish, you could get connected also to our trusted tech agency partner and vendors, based in Europe. <br /><br />
2. You can choose to interview and hire full-time employees, IT contractors/freelancers, Teams or collaborate with a tech agency – many possibilities and options to grow your teams and ensure business drive.<br /><br />
3. Search, browse and selected candidate profile(s) that suit your current needs and you would like to get in touch with.<br /><br />
4. Once we receive your interest, we will get in touch with you and will show you how cost-effective our collaboration could be! If you decide to cooperate with a ready-made team, or with an agency vendor from our partner network, it will be completely free for you. We won´t charge you anything. We request our professional fee only if you decide to hire a full-time employee or to collaborate with an IT / Tech contractor or freelancer. You will get a discount if you hire or engage more than two candidates. If you could not find what you need today, we can execute a recruitment project, based on your needs and tailored to your budget. <br /><br />
5. We will organize and coordinate the first conversation with the selected talent(s), team(s) and/or vendor(s).<br /><br />
6. You are fully set up to grow your teams and happy with your hiring!<br /><br />`,
  },
  {
    title: "For IT and Tech Talents",
    content: `This is an invitation-only platform. We would like to ensure our clients with the best available IT talents on the market. It is completely free for you – no subscription fees or any kind of provisions to pay. Your privacy is guaranteed and you will enter into a first conversation with a company-client only if you decide to! You are not going to be emailed with different requests from all possible sites. We respect your privacy.<br /><br />

1. Create your profile. It will appear anonymously, as we would like to guarantee your privacy, especially if you are on a confident search for your next challenging position or project.<br /><br />
2. If an employer company shows interest to get in touch with you, we will contact you and share all the information about the company-client – name, business segment, open role specifications and salary range.<br /><br />
3. You will decide if you would like to schedule a first conversation with the company-client or not.<br /><br />
4. If you decide to have a first conversation directly with the company, we will organize and coordinate it.<br /><br />
5. If you like each other, you can take the next steps as you agree.<br /><br />`,
  },
  {
    title: "For IT and Tech Teams",
    content: `Small, ready-made, independent IT / Tech Teams are very welcome to join! As this is an invitation-only platform, please, contact us. We would like to get to know you better. After receiving the invitation link, you can:<br /><br />

1. Create a profile of the team. <br /><br />
2. It will appear anonymously, as we would like to keep and guarantee your privacy and you will step into a first conversation with a client company, only if you decide. <br /><br />
3. If a client company shows interest to get in touch with you, we will contact you and share all the information about the company-client – name, business segment, project specifications and salary range. <br /><br />
4. You will decide if you would like to schedule a first conversation with the company-client or not. <br /><br />
5. If you decide to have a first conversation directly with the company, we will organize and coordinate it. <br /><br />
6. If you like each other, you can take the next steps as you agree. <br /><br />`,
  },
  {
    title: "For IT and Tech Agencies",
    content: `Reputable IT / Tech Agencies or IT Vendors are very welcome to join! As this is an invitation-only platform, please, contact us. We would like to get to know you better. After receiving the invitation link, you can:<br /><br />

1. Create an agency profile <br /><br />
2. Upload the available IT / Tech Talents and/or IT Teams you have on the bench. Each profile which you create will appear anonymously as we respect your business and the privacy of your team members. <br /><br />
3. If a client company shows interest in one or more of your IT talents, we will contact you and share all the information about the company-client – name, business segment, project specifications and salary range. <br /><br />
4. You will decide if you would like to schedule a first conversation with the company-client or not. <br /><br />
5. If you decide to have a first conversation directly with the company, we will organize and coordinate it.<br /><br />
6. If you like each other, you can take the next steps as you agree.<br /><br />`,
  },
];

const HowItWorks: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10">
      <h2 className="text-4xl font-bold text-primary mb-12">How It Works</h2>

      <div className="flex justify-center items-center w-full ">
        {/* FAQ Section */}
        <div className="w-full md:w-1/2 flex justify-end px-10 md:px-0">
          <div className="w-full md:w-2/3 bg-primary px-2 py-10 rounded-xl shadow-lg">
            {faqItems.map((item, index) => (
              <div key={index} className="">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center w-full p-2 bg-white text-left text-primary font-semibold rounded-lg shadow focus:outline-none focus:ring focus:ring-purple-500"
                >
                  <span>{activeIndex === index ? "-" : "+"}</span>
                  <span className="ml-4">{item.title}</span>
                </button>
                {activeIndex === index && (
                  <div
                    className="p-4 bg-primary text-white border border-gray-200"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-full md:w-1/3">
          <img
            src="/logo.png"
            alt="Top IT Hub Logo"
            className="h-40 w-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

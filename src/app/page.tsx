import React from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import BannerComponent from "@/components/BannerComponent";
import AboutUs from "@/components/AboutUs";
import ShowroomComponent from "@/components/ShowroomComponent";
import OurTeam from "@/components/OurTeam";
import Map from "@/components/Map";
import WhatWeOffer from "@/components/WhatWeOffer";

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <section id="banner" className="w-full">
        <BannerComponent />
      </section>
      <section id="aboutUs" className="w-full">
        <AboutUs />
      </section>
      <section id="showroom" className="w-full">
        <ShowroomComponent />
      </section>
      <section id="offer" className="w-full">
        <WhatWeOffer />
      </section>
      <section id="team" className="w-full">
        <OurTeam />
      </section>
      <section className="w-full">
        <Map />
      </section>
      <Footer />
    </div>
  );
}

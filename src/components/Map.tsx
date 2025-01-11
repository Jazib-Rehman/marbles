import React from "react";

export default function Map(): React.JSX.Element {
  return (
    <div className="w-full h-[450px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3362.1419056246305!2d73.45991507565444!3d32.57573937374844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDM0JzMyLjciTiA3M8KwMjcnNDUuMCJF!5e0!3m2!1sen!2s!4v1718192440254!5m2!1sen!2s"
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
} 
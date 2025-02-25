import { useState } from "react";
import Image from "next/image";

const PropertyImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-60 w-full bg-gray-200 rounded-lg overflow-hidden">
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt={alt}
        width={600}
        height={400}
        className="w-full h-full object-cover transition-transform duration-300"
      />

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 transition"
      >
        ◀
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 transition"
      >
        ▶
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PropertyImageCarousel;

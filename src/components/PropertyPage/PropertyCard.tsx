import Image from "next/image";
import CreateAdModal from "./CreateAdModal";

const PropertyCard = ({ property }: { property: any }) => {
  console.log("propertycard",property);
  
  return (
    <div className="bg-white shadow-lg w-auto rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-64 md:h-96">
        <img
        src={`data:image/png;base64,${property.image}`}
          // src={property.image}
          alt={property.name}
          // // layout="fill"
          // objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Property Info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{property.name}</h3>
          <button className="text-blue-600">
            {/* Heart Icon */}
            ❤️
          </button>
        </div>
        <p className="text-gray-600">{property.location}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2">{property.description}</p>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-2">
          {property.bedrooms} Bedrooms {property.bathrooms} Bathrooms{" "}
          {property.area} sq ft
        </p>
        <CreateAdModal 
          // isOpen={isEditModalOpen} 
          // onClose={() => setIsEditModalOpen(false)} 
          ad={property} // Pass the ad data to modal
          isEditMode={true} // Tell modal it's edit mode
        />
        {/* Price and CTA */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold">{property.price}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

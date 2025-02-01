import Image from "next/image";

const TrendingPropertyCard = ({ property }:any) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden p-4">
      {/* Property Image */}
      <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="mt-3">
        <h3 className="font-bold text-lg">{property.name}</h3>
        <p className="text-gray-500 text-sm">{property.location}</p>
        <p className="text-blue-600 font-semibold text-lg mt-1">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm">
          {property.beds} beds • {property.baths} baths
        </p>
      </div>
    </div>
  );
};

export default TrendingPropertyCard;

import { Key } from "react";
import TrendingPropertyCard from "./TrendingPropertyCard";

const TrendingProperties = ({ properties }:any) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-3">Trending Properties</h2>
      <div className="space-y-4">
        {properties.length > 0 ? (
          properties.map((property: { id: Key | null | undefined; }) => (
            <TrendingPropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-gray-500">No trending properties found.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingProperties;

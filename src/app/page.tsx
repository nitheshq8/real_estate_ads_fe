import PropertyAds from "@/components/PropertyAds";
import Image from "next/image";
import { theme } from "../../theme";
import Myhomepage from "@/components/Myhomepage";
import MYLayout from "@/components/PropertyPage/MYLayout";
import PropertyFilters from "@/components/PropertyPage/PropertyFilters";
import PropertyListing from "@/components/PropertyPage/PropertyListing";

export default function Home() {
  return (
    <div className="">
      <MYLayout>
    <PropertyListing/>
      </MYLayout>
  {/* <Myhomepage/> */}
      {/* <PropertyAds/> */}

    </div>
  );
}

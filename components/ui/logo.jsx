"use client";

import Image from "next/image";
import Link from "next/link";
import LogoS from "../../assets/logo.png";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-between space-x-2 text-white">
      <div className="relative w-14 h-14 md:w-12 flex items-center md:h-12">
        <Image
          src={LogoS}
          alt="Elite League Logo"
          height={60}
          width={60}
          className="object-center object-contain"
          priority
        />
      </div>
      <div className="flex flex-col w-full md:w-auto">
        <span className="font-mukta text-3xl md:text-3xl font-extrabold capitalize">
          Elite League
        </span>
        <p className="text-sm md:text-md font-semibol font-montserrat text-[12px] md:text-lg uppercase opacity-75 text-left">
          nigeria
        </p>
      </div>
    </Link>
  );
};

export default Logo;

"use client"
import { useState } from "react";
import chromeSvg from '@assets/chrome.svg';
import Image from "next/image";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { sendToBackgroundViaRelay } from "@plasmohq/messaging";
import { useRouter } from "next/navigation";

export default function ChromeExtensionButton({
  text = "Chrome Extension",
  ...props
}) {
  const [_, setIsHovering] = useState(false);
  const router = useRouter();
 

  return (
    <button
      {...props}
      className="group relative my-8 rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-1 text-white transition-transform hover:scale-110 active:scale-105"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 px-4 py-2 text-white">
        <Image src={chromeSvg} alt="Chrome Extension" className="w-6 h-6" />
        <span className="font-semibold">{text}</span>

        <ArrowTopRightIcon
          height={20}
          width={20}
          className="opacity-75 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-yellow-300 group-hover:opacity-100"
        />
      </div>
    </button>
  );
}




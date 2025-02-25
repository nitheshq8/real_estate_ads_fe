"use client";
import { useState } from "react";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number; // Avatar size
}

export default function UserAvatar({ name, imageUrl, size = 40 }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-white font-bold text-lg">{getInitials(name)}</span>
      )}
    </div>
  );
}

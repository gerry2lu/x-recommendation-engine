// app/page.tsx
"use client";
import TweetGenerator from "@/components/TweetGenerator";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [tweets, setTweets] = useState<string[]>([]);

  return (
    <div
      className="relative h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div
        className={`relative bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-10 shadow-lg ${
          tweets.length > 0 ? "w-3/4" : "w-1/3"
        }`}
      >
        <div className="flex justify-center">
          <Image
            src="/immutablelogo.png"
            alt="Immutable X Logo"
            className="w-16"
          />
        </div>
        <h1 className="text-4xl font-bold text-center my-8 text-white w-full">
          Tweet Recommendation
          <br />
          Engine
        </h1>

        <TweetGenerator tweets={tweets} setTweets={setTweets} />
      </div>
    </div>
  );
}

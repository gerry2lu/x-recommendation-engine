// app/page.tsx
"use client";
import TweetGenerator from "@/components/TweetGenerator";
import { useState, useEffect } from "react";
import PassportLoginButton from "@/components/PassportLoginBtn";
import { passportInstance } from "@/utils/setupDefault";

export default function Home() {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isImmutable, setIsImmutable] = useState(false);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const userProfileData = await passportInstance.getUserInfo();
      if (!userProfileData) return;
      setEmail(userProfileData.email || null);
    };
    fetchUserProfileData();
  }, [isAuthenticated]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getEmailDomain(email: string) {
    return email.split("@")[1];
  }

  useEffect(() => {
    if (!email) return;
    const domain = getEmailDomain(email as string);
    if (domain === "immutable.com" && isAuthenticated) {
      setIsImmutable(true);
    } else {
      setIsImmutable(false);
    }
  }, [email]);

  return (
    <div
      className="relative h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute z-10 top-0 right-0 p-4">
        <PassportLoginButton
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        {/* {email && (
          <p className="text-gray-300 mt-2 ml-2 text-xs max-w-20">
            Signed in as {email}
          </p>
        )} */}
      </div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div
        className={`relative bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-10 shadow-lg overflow-y-scroll max-h-full ${
          isClient && tweets.length > 0 ? "w-[80%]" : "w-[50%]"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mt-2 mb-6 text-white w-full">
          Tweet Recommendation
          <br />
          Engine
        </h1>

        <TweetGenerator
          tweets={tweets}
          setTweets={setTweets}
          isImmutable={isImmutable}
        />
      </div>
    </div>
  );
}

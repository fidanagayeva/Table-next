"use client";
import MyComponent from "@/components/MyComponent"; 
import { api } from "@/http/api";
import useSWR from "swr";

export default function Home() {
  const { data, isLoading, error } = useSWR(api.albums);

  const IsloadinData = isLoading && !error;
  const isError = error && !isLoading;

  return (
    <main className="max-w-[1440px] mx-auto">
      
      {IsloadinData && (
        <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
      )}
      {isError && (
        <button className="bg-red-200 text-red-800 px-3 py-2 rounded-md">
          {error.message as string}
        </button>
      )}

      
      
      <div className="mt-10">
        <MyComponent />
      </div>
      
    </main>
  );
}

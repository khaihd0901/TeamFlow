import React from "react";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-gray-300 aspect-video rounded-xl" />
          <div className="bg-gray-300 aspect-video rounded-xl" />
          <div className="bg-gray-300 aspect-video rounded-xl" />
        </div>
        <div className="bg-gray-300 aspect-video flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  );
};

export default HomePage;

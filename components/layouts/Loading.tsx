import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center w-screen dark:bg-neutral-800  justify-center min-h-screen">
      <div className="text-center dark:bg-neutral-700 mx-auto p-6 h-fit max-w-sm rounded-lg w-fit">
      <div className=" flex mx-auto text-center  size-10 my-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        <p className="text-lg">Veuillez patienter, chargement des données...</p>
      </div>
    </div>
  );
};

export default Loading;


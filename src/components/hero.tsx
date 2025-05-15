import { SearchInput } from "./search-input"

const Hero = () => {

  return (
    <div className="w-full border-b border-foreground/20  items-center text-center flex flex-col  mt-12">
      <div className="font-bold text-[56px]  max-w-[1200px] m-auto  text-gray-200  ">
        The Unreal Engine Plugin Registry
      </div>
        <div className=" text-2xl  max-w-[1200px] font-medium m-auto mt-8 text-gray-600">
          Discover, share, and contribute to open-source Unreal Engine plugins.
        </div>
        <div className="mt-10 mb-24">

     	 <SearchInput />
        </div>

    </div>
  );
};

export { Hero };

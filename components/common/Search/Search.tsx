import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useFormSetting } from "../hooks/useFormSetting";

const Search = ({ name }: { name?: string }) => {
  const { setFilterSearchText, setSearchFieldName } = useFormSetting();

  useEffect(() => {
    if (name) {
      setSearchFieldName(name);
    }
  }, [name]);

  return (
    <>
      {/* <div className="flex items-center border-2 border-green-200 rounded-full overflow-hidden mb-4">
        <Input
          type="text"
          className="flex-grow px-4 py-2 outline-none"
          placeholder="Search..."
          onChange={(e) => setFilterSearchText(e?.target?.value || "")}
        />
        <button className="px-4">
          <Icons.search className=" text-gray-400" />
        </button>
        <button className="px-4">
          <Icons.search className=" text-gray-400" />
        </button>
      </div> */}

      <div className=' py-4 relative'>
            <Input
                placeholder='Search....'
                className='bg-white border-2 border-primary focus:border-none pl-[15px]  py-2 rounded-lg'
                onChange={(e) => setFilterSearchText(e?.target?.value || "")}
            />
            {/* <Icons.search className='absolute top-1/2 left-5 transform -translate-y-1/2 text-gray-400' /> */}
            {/* <Icons.filter className='absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400' /> */}
            <Icons.search className='absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400' />
        </div>
    </>
  );
};

export default Search;

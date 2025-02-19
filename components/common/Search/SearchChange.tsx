import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { useFormSetting } from '../hooks/useFormSetting';

const SearchChange = ({ name, onSearchChange }:any) => {
    const {
        setSearchFieldName
    } = useFormSetting();

    useEffect(() => {
        if (name) {
            setSearchFieldName(name);
        }
    }, [name]);

    return (
        <div className='bg-white p-4 relative'>
            <Input
                placeholder='Search....'
                className='bg-white border-2 border-primary focus:border-none pl-[50px] pr-3 py-6 rounded-xl'
                onChange={(e) => onSearchChange(e?.target?.value || "")}
            />
            <Icons.search className='absolute top-1/2 left-10 transform -translate-y-1/2 text-gray-400' />
        </div>
    );
};

export default SearchChange;

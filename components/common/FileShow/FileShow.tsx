import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import React from 'react'

const FileShow = ({ path, name }: any) => {

    const fileExtension = path ? path.split('.').pop().toLowerCase() : "";


    return (
        <div className='w-full'>
            <a href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${path}`} target='_blank' className='flex gap-1 !text-blue-800 !underline'>
                {fileExtension == "pdf" && <Icons.pdf />} {name}.{fileExtension}
            </a>
        </div>
    )
}

export default FileShow
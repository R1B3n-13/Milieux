import React from 'react'
import Image from 'next/image';

interface AdminTopBarProps {
    name: string;
    headerLogo: string;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ name, headerLogo }) => {
    const placeHolderLogo = "https://placehold.co/150.png";

    return (
        <>
            <div className="flex flex-row w-full justify-evenly rounded py-10 font-montserrat">
                <div className="w-[40rem]">
                    <div className="text-3xl font-bold w-full">Admin Panel</div>
                    <div className="text-8xl font-extrabold">{name}</div>
                </div>
                
                <Image src={headerLogo === null ? placeHolderLogo : headerLogo} 
                        alt="header logo" 
                        width={150}
                        height={150}
                        className='w-fit h-fit' />
            </div>
        </>
    )
}

export default AdminTopBar
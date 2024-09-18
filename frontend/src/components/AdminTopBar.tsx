import React from 'react'
import Image from 'next/image';

interface AdminTopBarProps {
    name: string;
    headerLogo: string;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ name, headerLogo }) => {
    return (
        <>
            <div className="flex flex-row w-full justify-evenly rounded py-10 font-montserrat">
                <div className="w-[40rem]">
                    <div className="text-3xl font-bold w-full">Admin Panel</div>
                    <div className="text-8xl font-extrabold">{name}</div>
                </div>
                <Image src={headerLogo} alt="header logo" height={400} width={400} />
            </div>
        </>
    )
}

export default AdminTopBar
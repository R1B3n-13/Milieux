import { useStoreContext } from '@/contexts/StoreContext';
import React from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import CustomizeUiType from './CustomizeUiType';
import CustomizeUiImages from './CustomizeUiImages';

const UpdateFromHome = () => {

    const { storeInfo, loggedInUserId } = useStoreContext();

    return (
        <>
            {/* update carousel images */}
            <div className='flex w-full justify-end items-end'>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className='border-[1.5px] border-gray-200' variant='ghost'>Edit Hero Section</Button>
                    </DrawerTrigger>

                    <DrawerContent className='w-full' >
                        <div className="flex flex-col justify-center items-center mx-auto w-full max-w-sm">
                            <DrawerHeader className='flex justify-center items-center w-full text-sm'>
                                <DrawerTitle>Update Hero Section</DrawerTitle>
                            </DrawerHeader>

                            <div className='flex flex-col gap-2 justify-center items-center w-full'>
                                <CustomizeUiType />
                                <CustomizeUiImages />

                            </div>

                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className=' bg-black text-white hover:bg-gray-800 hover:text-white' variant="ghost">Close</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}

export default UpdateFromHome
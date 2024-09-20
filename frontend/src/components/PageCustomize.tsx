import { useStoreContext } from '@/contexts/StoreContext';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem } from './ui/accordion';
import { AccordionTrigger } from '@radix-ui/react-accordion';
import { useToast } from '@/hooks/use-toast';
import uploadToCloudinary from '@/app/api/cloudinaryActions';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    imgurl: string;
    store_id: number;
}

const PageCustomize = () => {
    const { storeInfo, setStoreInfo } = useStoreContext();
    const { toast } = useToast();
    const PORT = process.env.PORT || 'http://localhost:8081/api';

    const [uiType, setUiType] = useState(storeInfo.ui_type);

    const [newStoreName, setNewStoreName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    useEffect(() => {
    }, [storeInfo]);


    const handleStoreNameChange = async () => {
        if (!newStoreName) {
            setError("Store name can't be empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${PORT}/store/update/name/${storeInfo.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStoreName),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Store not found');
                } else {
                    throw new Error('Failed to update store name');
                }
            }

            // After successful name update, update the StoreContext with the new name
            setStoreInfo((prevStoreInfo: any) => ({
                ...prevStoreInfo,
                name: newStoreName,
            }));

        } catch (error: any) {
            console.error('Error updating store name:', error);
            setError(error.message || 'Failed to update store name');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoUpdate = async () => {
        try {
            let uploadedImageUrl = null;

            // If a file is selected, upload it to Cloudinary
            if (selectedFile) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(selectedFile);

                fileReader.onload = async () => {
                    const fileBase64 = fileReader.result as string;

                    const { success, url } = await uploadToCloudinary(fileBase64, 'image');

                    if (success) {
                        uploadedImageUrl = url;
                        console.log("Logo uploaded:", uploadedImageUrl);
                    } else {
                        throw new Error("Image upload failed");
                    }

                    // After successful image upload, update the store's ui_images
                    await updateLogo(uploadedImageUrl);
                };
            }
        } catch (error: any) {
            console.error('Error updating store UI:', error);
            setError(error.message || 'Failed to update store UI');
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const updateLogo = async (imageUrl: string | null) => {
        if (!imageUrl) return;

        try {
            const response = await fetch(`${PORT}/store/update/logo/${storeInfo.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imageUrl),
            });
            setSelectedFile(null);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Store not found');
                } else {
                    throw new Error('Failed to update store images');
                }
            }

            // After successful image update, update the StoreContext with the new images
            setStoreInfo((prevStoreInfo: any) => ({
                ...prevStoreInfo,
                logo_url: imageUrl,
            }));

            toast({
                title: "Logo",
                description: "Logo updated successfully",
            });

        } catch (error: any) {
            console.error('Error updating Logo:', error);
            setError(error.message || 'Failed to update images');
        }
    };


    return (
        <>
            <ScrollArea className='w-[95%] h-[35rem] mr-2 flex flex-col flex-wrap flex-auto'>
                <Accordion type='single' collapsible className='w-[90%]'>
                    <AccordionItem value='item1'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Change store name
                        </AccordionTrigger>
                        <AccordionContent className='flex items-center justify-center gap-2 p-5'>
                            <Input
                                className='w-[30%] focus:border-none'
                                placeholder={storeInfo.name}
                                value={newStoreName}
                                onChange={(e) => setNewStoreName(e.target.value)} // Update the state with input
                            />
                            <Button
                                onClick={handleStoreNameChange}
                                className='w-[20%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white'
                                disabled={isSubmitting}
                                variant={'ghost'}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </AccordionContent>
                        {error && <p className='text-red-500'>{error}</p>}
                    </AccordionItem>

                    {/* Logo Update */}
                    <AccordionItem value='item2'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Change store logo
                        </AccordionTrigger>
                        <AccordionContent className='flex items-center justify-center gap-2 p-5'>
                            <Input className='w-[30%] border-[1.5px] border-gray-200 focus:border-none' placeholder='Update Logo' type='file' onChange={handleFileChange} />
                            <Button onClick={handleLogoUpdate} className='w-[20%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
                                Submit
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Banner update  */}
                    <AccordionItem value='item3'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Change store banner
                        </AccordionTrigger>
                        <AccordionContent className='flex items-center justify-center gap-2 p-5'>
                            <Input className='w-[30%] focus:border-none' placeholder={storeInfo.banner} />
                            <Button className='w-[20%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
                                Submit
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* banner-subtext update */}
                    <AccordionItem value='item4'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Change store banner subtext
                        </AccordionTrigger>
                        <AccordionContent className='flex items-center justify-center gap-2 p-5'>
                            <Input className='w-[30%] focus:border-none' placeholder={storeInfo.banner_subtext} />
                            <Button className='w-[20%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
                                Submit
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </ScrollArea>
        </>
    );
}

export default PageCustomize;

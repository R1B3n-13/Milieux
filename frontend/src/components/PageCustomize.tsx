import { useStoreContext } from '@/contexts/StoreContext';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem } from './ui/accordion';
import { AccordionTrigger } from '@radix-ui/react-accordion';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
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
    const [selectedUiImages, setselectedUiImages] = useState<File[] | null>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // Loading state
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);  // State for selected products
    const columns: string[] = ['Product ID', 'Image', 'Product Name'];

    useEffect(() => {
        if (storeInfo && storeInfo.top_items) {
            // fetchTopProducts();
            // setTopProducts(storeInfo.top_items);
            fetchProducts(storeInfo.id);
        }
    }, [storeInfo]);

    const fetchTopProducts = async () => {
        setLoading(true);  // Set loading to true before fetching
        try {
            const fetchedProducts: Product[] = [];
            for (const productId of storeInfo.top_items) {
                const response = await fetch(PORT + `/product/find/${productId}`);

                if (response.ok) {
                    const data: Product = await response.json();
                    fetchedProducts.push(data);
                } else {
                    console.error('Failed to fetch product info:', response.statusText);
                }
            }
            setTopProducts(fetchedProducts);  // Set the fetched products
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);  // Set loading to false after fetching is complete
        }
    };

    const fetchProducts = async (store_id: number) => {
        try {
            const response = await fetch(PORT + `/product/store/${store_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data: Product[] = await response.json();
            setProducts(data);

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

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
            } else {
                // If no file is uploaded, just update the UI type
                console.log('only ui type');

                await updateStoreUiType();
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

    const handleHeroUpdate = async () => {
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
                        console.log("Image uploaded:", uploadedImageUrl);
                    } else {
                        throw new Error("Image upload failed");
                    }

                    // After successful image upload, update the store's ui_images
                    await updateUiImages(uploadedImageUrl);
                };
            }   else {
                await updateStoreUiType();
            }
        } catch (error: any) {
            console.error('Error updating store UI:', error);
            setError(error.message || 'Failed to update store UI');
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

    // Function to update ui_images separately
    const updateUiImages = async (imageUrl: string | null) => {
        if (!imageUrl) return;

        try {
            const updatedImages = [...storeInfo.ui_images, imageUrl];

            const response = await fetch(`${PORT}/store/update/ui-images/${storeInfo.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedImages),
            });

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
                ui_images: updatedImages,
            }));

            toast({
                title: "Image updated",
                description: "Hero images updated successfully",
            });

        } catch (error: any) {
            console.error('Error updating images:', error);
            setError(error.message || 'Failed to update images');
        }
    };

    // Function to update only the UI type
    const updateStoreUiType = async () => {
        try {
            const response = await fetch(`${PORT}/store/update/ui-type/${storeInfo.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ui_type: uiType }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Store not found');
                } else {
                    throw new Error('Failed to update store UI');
                }
            }

            // After successful UI update, update the StoreContext with the new UI type
            setStoreInfo((prevStoreInfo: any) => ({
                ...prevStoreInfo,
                ui_type: uiType,
            }));

            toast({
                title: "Hero section updated",
                description: `Hero section set to ${uiType === 1 ? 'Static Images' : 'Carousel'}`,
            });

        } catch (error: any) {
            console.error('Error updating store UI:', error);
            setError(error.message || 'Failed to update store UI');
        }
    };

    const handleTopProductsUpdate = async () => {
        try {
            const response = await fetch(`${PORT}/store/update/top-products/${storeInfo.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedProducts), // Send selected product IDs
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Store not found');
                } else {
                    throw new Error('Failed to update top products');
                }
            }

            // Optionally, update the StoreContext with the new top products
            setStoreInfo((prevStoreInfo: any) => ({
                ...prevStoreInfo,
                top_items: selectedProducts, // Update the top_items with the newly selected products
            }));

            toast({
                title: "Top products updated",
                description: `Successfully updated top products`,
            });

        } catch (error: any) {
            console.error('Error updating top products:', error);
            setError(error.message || 'Failed to update top products');
        }
    };

    const handleProductSelection = (productId: number) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)  // Remove product if already selected
                : [...prevSelected, productId]  // Add product if not selected
        );
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

                    {/* Hero Section */}
                    <AccordionItem value='item5'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Change Hero Section
                        </AccordionTrigger>
                        <AccordionContent className='flex flex-col items-center justify-center gap-5 p-5'>
                            <div className='flex gap-2 border-[1.5px] rounded-xl w-max h-max'>
                                <Button
                                    onClick={() => setUiType(1)}
                                    className='w-[50%] h-[40%] hover:bg-white hover:text-black'
                                    variant={'ghost'}
                                    style={{
                                        backgroundColor: uiType === 2 ? '#ffffff' : '#000000',
                                        color: uiType === 2 ? '#000' : '#fff'
                                    }}
                                >
                                    Static Images
                                </Button>

                                <Button
                                    onClick={() => setUiType(2)}
                                    className='w-[50%] h-[40%] hover:bg-white hover:text-black'
                                    variant={'ghost'}
                                    style={{
                                        backgroundColor: uiType === 1 ? '#ffffff' : '#000',
                                        color: uiType === 1 ? '#000' : '#fff'
                                    }}
                                >
                                    Carousel
                                </Button>
                            </div>

                            <div className='w-max'>
                                <Card className='flex flex-wrap p-2 gap-2'>
                                    {storeInfo.ui_images.map((img: string, index: number) => (
                                        <CardContent key={index} className='flex flex-col items-center justify-between border-[1.5px] rounded-xl border-gray-200 w-fit h-[200px] p-4'>
                                            <div className='flex flex-1 justify-center items-center'>
                                                <Image
                                                    src={img}
                                                    alt='Hero Image'
                                                    width={100}
                                                    height={100}
                                                    className='object-contain'
                                                />
                                            </div>

                                            <CardFooter className='flex flex-row items-center justify-center'>
                                                <Button className='w-max bg-black text-white hover:bg-gray-800 hover:text-white mt-auto pt-2' variant={'ghost'}>
                                                    Delete
                                                </Button>
                                            </CardFooter>
                                        </CardContent>
                                    ))}
                                </Card>
                            </div>

                            <Input className='w-[30%] border-[1.5px] border-gray-200 focus:border-none' placeholder='Upload more images' type='file' onChange={handleFileChange} />
                            <Button onClick={handleHeroUpdate} className='w-[10%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
                                Submit
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Featured Productrs */}
                    <AccordionItem value='item6'>
                        <AccordionTrigger className='flex p-2 w-full justify-center items-center'>
                            Update Featured Products
                        </AccordionTrigger>
                        <AccordionContent className='flex flex-col items-center justify-center gap-2 p-5'>
                            <Table className="w-70%">

                                <TableHeader>
                                    <TableRow >
                                        <TableHead className='flex justify-center items-center gap-2'>Product ID</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Product Name</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className='flex justify-center items-center gap-2' >
                                                <Checkbox
                                                    className='checked:background-black'
                                                    checked={selectedProducts.includes(product.id)}
                                                    onCheckedChange={() => handleProductSelection(product.id)}
                                                />
                                                {product.id}
                                            </TableCell>
                                            <TableCell>
                                                <Image
                                                    src={product.imgurl}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                    className='object-cover'
                                                />
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button onClick={handleTopProductsUpdate} className='w-[20%] h-[40%] bg-black text-white hover:bg-gray-800 hover:text-white' variant={'ghost'}>
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

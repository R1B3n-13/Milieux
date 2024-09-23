import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useStoreContext } from '@/contexts/StoreContext';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';

interface Product {
    id: string | number;
    imgurl: string;
    name: string;
    price: number;
    category: string;
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    const { storeInfo, loading } = useStoreContext();
    const { addToCart } = useShoppingCart();

    const handleAddToCart = (product: Product) => {

        const productToAdd = {
            id: product.id,
            name: product.name,
            price: product.price, 
            quantity: 1,
            imageSrc: product.imgurl,
            imageAlt: product.name,
        };
        addToCart(productToAdd);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!storeInfo) {
        return <div>Error loading store information</div>;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
                <div key={product.id} className='bg-white p-4 shadow rounded'>
                    <Link href={`/products/${product.id}?id=${storeInfo.id}`} className='block'>
                        <Image
                            src={product.imgurl} // Ensure this is an absolute path
                            alt={product.name}
                            width={100}
                            height={100}
                            className='w-full h-48 object-cover rounded'
                        />
                        <h3 className='text-lg font-medium mt-2'>{product.name}</h3>
                        <p className='text-gray-600'>{product.price} BDT</p>
                    </Link>
                    <div className='flex items-center w-full mt-4'>
                        <Button
                            className='font-montserrat'
                            style={{ backgroundColor: storeInfo.ui_secondary_color }}
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to cart
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;

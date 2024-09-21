import React from 'react'

import Image from 'next/image';

import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import ShoppingCart from '@/components/ShoppingCart';
import cartIcon from '@/assets/icons/cart.svg';

const ShoppingCartContainer = () => {
  const { getCartItemCount } = useShoppingCart();
  const { setOpen } = useShoppingCart(); // Use the setOpen from the context to open/close cart
  return (
    <>
            <ShoppingCart />
            <div className="fixed top-20 right-7 pb-6 h-5 w-5 rounded-2xl font-semibold">
                <Image
                    src={cartIcon}
                    alt='cart icon'
                    onClick={() => setOpen(true)}
                    className="fixed top-10 right-10"
                    height={50}
                    width={50}
                />
                <p className="fixed top-20 right-8 font-semibold "> {getCartItemCount()} </p>
            </div>
    </>
  )
}

export default ShoppingCartContainer
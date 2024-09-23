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
                <Image
                    src={cartIcon}
                    alt='cart icon'
                    onClick={() => setOpen(true)}
                    className="fixed top-5 right-8"
                    height={50}
                    width={50}
                />
                <p className="fixed top-10 right-5 font-semibold "> {getCartItemCount()} </p>
    </>
  )
}

export default ShoppingCartContainer
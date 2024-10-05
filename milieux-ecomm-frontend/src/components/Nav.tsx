"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import Image from 'next/image'
import { useStoreContext } from '@/contexts/StoreContext'
import { Button } from './ui/button'


const Nav = () => {

    const { storeInfo, loggedUserInfo, loading } = useStoreContext();
    
    console.log(storeInfo);
    console.log(loggedUserInfo);
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!storeInfo) {
        return <div>Error loading store information</div>;
    }

    return (
        <header className='flex items-start padding-x z-10 w-full h-fit'>

            <nav className='flex justify-start items-center max-container'>
                <Link href={`/?id=${storeInfo.id}`} passHref>
                    <Image
                        className="object-contain max-w-[80px]"
                        src={
                            storeInfo.logo_url === null
                                ? "https://placehold.co/600x400/png"
                                : storeInfo.logo_url
                        }
                        alt="store logo"
                        width={120}
                        height={120}
                    />
                </Link>

                <ul className='flex-1 flex justify-center items-center gap-10'>
                    <NavigationMenu>
                        <NavigationMenuList>

                            <NavigationMenuItem>
                                <Link href={`/?id=${storeInfo.id}`} passHref>
                                    <Button variant={'ghost'}
                                        className="font-monts errat leading-normal 
                                            text-lg test-slate-gray rounded-none
                                            hover:bg-white hover:border-b-2"
                                        style={{
                                            borderBottomColor: storeInfo.ui_base_color ?
                                                storeInfo.ui_base_color : "#000000"
                                        }} >
                                        Home
                                    </Button>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href={`/products?id=${storeInfo.id}`} passHref>
                                    <Button variant={'ghost'}
                                        className="font-monts errat leading-normal 
                                            text-lg test-slate-gray rounded-none
                                            hover:bg-white hover:border-b-2"
                                        style={{
                                            borderBottomColor: storeInfo.ui_base_color ?
                                                storeInfo.ui_base_color : "#000000"
                                        }} >
                                        Products
                                    </Button>
                                </Link>
                            </NavigationMenuItem>

                            {/* <NavigationMenuItem>
                                <a
                                    href={`${socialFrontendUrl}/persona/${storeInfo.id}`}
                                    className="font-monts errat leading-normal 
                                    text-lg test-slate-gray rounded-none
                                    hover:bg-white hover:border-b-2 font-inter"
                                    style={{
                                        borderBottomColor: storeInfo.ui_base_color ?
                                            storeInfo.ui_base_color : "#000000"
                                    }}
                                >
                                    See our social page
                                </a>
                            </NavigationMenuItem> */}

                            {storeInfo.id === loggedUserInfo.id && (
                                <Link href={`/admin?id=${storeInfo.id}`} passHref>
                                    <Button variant={'ghost'}
                                        className="font-monts errat leading-normal 
                                                                        text-lg test-slate-gray rounded-none
                                                                        hover:bg-white hover:border-b-2"
                                        style={{
                                            borderBottomColor: storeInfo.ui_base_color ?
                                                storeInfo.ui_base_color : "#000000"
                                        }} >
                                        Admin Panel
                                    </Button>
                                </Link>

                            )}

                        </NavigationMenuList>
                    </NavigationMenu>

                </ul>
            </nav>
        </header>
    )
}

export default Nav;
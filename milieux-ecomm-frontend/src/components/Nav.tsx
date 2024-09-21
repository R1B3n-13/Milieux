"use client"

import headerLogo from '@/assets/images/header-logo.svg'
import hamburger from '@/assets/icons/hamburger.svg'
import { navLinks } from '../constants'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import Image from 'next/image'


const Nav = () => {

    return (
        <header className='padding-x py-2 z-10 w-full'>
            <nav className='flex justify-between items-center max-container'>
                <a href="/" className='pl-[17rem]'>
                    <Image src={headerLogo}
                        alt="logo"
                        width={130}
                        height={29} />
                </a>

                <ul className='flex-1 flex justify-center items-center gap-16'>
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navLinks.map((item) => (
                                <NavigationMenuItem>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            <div className='font-monts errat leading-normal text-lg test-slate-gray'>
                                                {item.label}
                                            </div>
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                </ul>
            </nav>
        </header>
    )
}

export default Nav;
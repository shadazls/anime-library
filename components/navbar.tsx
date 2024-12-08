'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import {
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';
import NextLink from 'next/link';

import { GithubIcon, SearchIcon } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';
// import { useAuth } from '../lib/useAuth'; // Importer le hook d'authentification
import { useAuth } from '@/app/context/AuthContext';
import { Avatar } from '@nextui-org/avatar';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/dropdown';

export const Navbar = () => {
    const { isAuthenticated, user } = useAuth(); // Utiliser le hook pour savoir si l'utilisateur est connecté

    const searchInput = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: 'bg-white/15 border-white border',
                input: ['text-sm text-white', 'placeholder:text-white'],
            }}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
                <SearchIcon className="text-base text-white pointer-events-none flex-shrink-0" />
            }
            type="search"
        />
    );

    return (
        <NextUINavbar
            maxWidth="xl"
            position="sticky"
            className="bg-transparent"
            isBordered
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                        className="flex justify-start items-center gap-1"
                        href="/"
                    >
                        <p className="font-AmrysSemibold text-3xl">Kurosaw</p>
                    </NextLink>
                </NavbarBrand>
                <ul className="hidden lg:flex gap-4 justify-start ml-4">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <NextLink
                                className={clsx(
                                    linkStyles({ color: 'foreground' }),
                                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                                )}
                                color="foreground"
                                href={item.href}
                            >
                                {item.label}
                            </NextLink>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link
                        isExternal
                        aria-label="Github"
                        href={siteConfig.links.github}
                    >
                        <GithubIcon className="text-default-500" />
                    </Link>
                    <ThemeSwitch />
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    {searchInput}
                </NavbarItem>
                {!isAuthenticated ? (
                    <NavbarItem className="hidden md:flex gap-4">
                        <Button
                            className="text-sm font-medium text-white bg-default-100"
                            variant="flat"
                            radius="sm"
                            as={NextLink}
                            href="/login"
                        >
                            Log In
                        </Button>
                        <Button
                            className="text-sm font-medium text-black bg-white"
                            variant="flat"
                            radius="sm"
                            as={NextLink}
                            href="/register"
                        >
                            Get Started
                        </Button>
                    </NavbarItem>
                ) : (
                    <>
                        <NavbarItem className="ml-12">
                            <NextLink
                                className={clsx(
                                    linkStyles({ color: 'foreground' }),
                                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                                )}
                                color="foreground"
                                href={`/user/${user?.name}`}
                            >
                                My Library
                            </NextLink>
                        </NavbarItem>
                        <NavbarItem className="hidden md:flex gap-4">
                            {/* <p className="text-white">{user?.name}</p> */}
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        showFallback
                                        name={user?.name}
                                        src={user?.avatar}
                                        className="transition-transform cursor-pointer"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Profile Actions"
                                    variant="flat"
                                >
                                    <DropdownItem
                                        key="settings"
                                        onClick={() => {
                                            window.location.href = `/user/${user?.name}/settings`;
                                        }}
                                    >
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        className="text-danger"
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(
                                                    '/api/auth/logout',
                                                    {
                                                        method: 'POST',
                                                    }
                                                );

                                                if (response.ok) {
                                                    // Redirection vers la page d'accueil après déconnexion
                                                    window.location.href = '/';
                                                } else {
                                                    console.error(
                                                        'Failed to log out:',
                                                        response.statusText
                                                    );
                                                }
                                            } catch (error) {
                                                console.error(
                                                    'An error occurred during logout:',
                                                    error
                                                );
                                            }
                                        }}
                                    >
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <Link
                    isExternal
                    aria-label="Github"
                    href={siteConfig.links.github}
                >
                    <GithubIcon className="text-default-500" />
                </Link>
                <ThemeSwitch />
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarMenu>
                {searchInput}
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                color={
                                    index === 2
                                        ? 'primary'
                                        : index ===
                                            siteConfig.navMenuItems.length - 1
                                          ? 'danger'
                                          : 'foreground'
                                }
                                href="#"
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </NextUINavbar>
    );
};

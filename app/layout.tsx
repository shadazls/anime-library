import '@/styles/globals.css';
import { Link } from "@heroui/link";
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import { Providers } from './providers';

import { Navbar } from '@/components/navbar';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { Divider } from "@heroui/divider";

import { AuthProvider } from './context/AuthContext';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    'min-h-screen font-sans antialiased bg-test',
                    fontSans.variable
                )}
            >
                <Providers
                    themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
                >
                    <AuthProvider>
                        <div className="relative flex flex-col min-h-screen">
                            <Navbar />
                            <main className="container mx-auto max-w-full pt-16 px-6 flex-grow">
                                {children}
                            </main>
                            <Divider className="mt-10" />
                            <footer className="w-full flex items-center justify-between py-8">
                                <p className="font-AmrysSemibold text-3xl ml-24">
                                    Kurosaw
                                </p>
                                <Link
                                    isExternal
                                    className="flex items-center gap-1 text-current"
                                    href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                                    title="nextui.org homepage"
                                >
                                    <span className="text-default-600">
                                        Créé par
                                    </span>
                                    <p className="text-primary mr-24">
                                        Shad AZUELOS & Marin LAFITTE
                                    </p>
                                </Link>
                            </footer>
                        </div>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}

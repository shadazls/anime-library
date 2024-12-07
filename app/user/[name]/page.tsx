'use client';

import ItemGrid from '@/components/ItemGrid';
import UserSection from '@/components/UserSection';
import { Avatar } from '@nextui-org/avatar';
import { useEffect, useState } from 'react';

interface Anime {
    id: number;
    title: {
        romaji: string;
        english?: string;
    };
    coverImage: {
        large: string;
    };
}

interface User {
    name: string;
    email: string;
    avatar: string;
    bannerImage: string;
    to_watch: Anime[];
    watching: Anime[];
    watched: Anime[];
    rewatching: Anime[];
    abandoned: Anime[];
}

interface UserPageProps {
    params: {
        name: string; // On récupère le nom de l'utilisateur via l'URL
    };
}

const UserPage = ({ params }: UserPageProps) => {
    const { name } = params;
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<string>('watching');

    useEffect(() => {
        document.body.style.background = '#121212';
        if (!name) return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/user?name=${name}`);
                const data = await response.json();
                setUser(data);
                console.log(data);
                document.body.style.background = `url(${data.bannerImage}) no-repeat center top, #121212`;
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [name]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'watching':
                return (
                    <ItemGrid
                        loading={false}
                        type="anime"
                        items={user.watching}
                        getName={(item) => item.Name}
                        getImage={(item) => item.image_url}
                        getId={(item) => item._id}
                    />
                );
            case 'to_watch':
                return (
                    <ItemGrid
                        loading={false}
                        type="anime"
                        items={user.to_watch}
                        getName={(item) => item.Name}
                        getImage={(item) => item.image_url}
                        getId={(item) => item._id}
                    />
                );
            case 'watched':
                return (
                    <ItemGrid
                        loading={false}
                        type="anime"
                        items={user.watched}
                        getName={(item) => item.Name}
                        getImage={(item) => item.image_url}
                        getId={(item) => item._id}
                    />
                );
            case 'abandoned':
                return (
                    <ItemGrid
                        loading={false}
                        type="anime"
                        items={user.abandoned}
                        getName={(item) => item.Name}
                        getImage={(item) => item.image_url}
                        getId={(item) => item._id}
                    />
                );
            case 'rewatching':
                return (
                    <ItemGrid
                        loading={false}
                        type="rewatching"
                        items={user.abandoned}
                        getName={(item) => item.Name}
                        getImage={(item) => item.image_url}
                        getId={(item) => item._id}
                    />
                );
            // case 'overview':
            //     return (
            //         <div className="flex">
            //             <div className="flex flex-col mr-32 min-w-96">
            //                 <h3 className="text-xl font-semibold mb-4">
            //                     Details
            //                 </h3>
            //                 <div className="flex gap-8">
            //                     <ul className="space-y-2">
            //                         <li>
            //                             <p className="text-gray-400">Email</p>
            //                         </li>
            //                         <li>
            //                             <p className="text-gray-400">Avatar</p>
            //                         </li>
            //                         <li>
            //                             <p className="text-gray-400">
            //                                 Banner Image
            //                             </p>
            //                         </li>
            //                     </ul>
            //                     <ul className="space-y-2">
            //                         <li>
            //                             <p>{user.email}</p>
            //                         </li>
            //                         <li>
            //                             <Image
            //                                 alt="User Avatar"
            //                                 src={user.avatar}
            //                                 width={50}
            //                                 height={50}
            //                                 // css={{ borderRadius: '50%' }}
            //                             />
            //                         </li>
            //                         <li>
            //                             <Image
            //                                 alt="Banner"
            //                                 src={user.bannerImage}
            //                                 width={300}
            //                                 height={100}
            //                             />
            //                         </li>
            //                     </ul>
            //                 </div>
            //             </div>

            //             <div className="flex flex-col">
            //                 <h3 className="text-xl font-semibold mb-4">
            //                     Description
            //                 </h3>
            //                 <div className="text-gray-400">
            //                     <ReactMarkdown>
            //                         {user.name || 'No description available.'}
            //                     </ReactMarkdown>
            //                 </div>
            //             </div>
            //         </div>
            //     );
            default:
                return null;
        }
    };

    return (
        <section className="p-4 mx-24">
            <div className="flex gap-4">
                <Avatar
                    showFallback
                    name={user?.name}
                    src={user?.avatar}
                    className="transition-transform min-h-60 min-w-60"
                />
                <div className="flex flex-col justify-center gap-4">
                    <h1 className="text-4xl font-bold text-white">
                        {user.name}
                    </h1>
                    <h2 className="text-lg text-gray-400">
                        This is a static description for the moment, the option
                        of adding a description for users coming soon.
                    </h2>
                </div>
            </div>
            <UserSection onTabChange={(key) => setActiveTab(key)} />
            {renderContent()}
        </section>
    );
};

export default UserPage;

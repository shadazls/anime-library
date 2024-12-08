'use client';

import DangerZoneSection from '@/components/DangerZoneSection';
import PersonalInfoSection from '@/components/PersonalInfoSection';
import PreferencesSection from '@/components/PreferencesSection';
import UserCard from '@/components/UserCard';
import { User } from '@/types';
import { useEffect, useState } from 'react';

interface UserPageProps {
    params: { name: string };
}

const UserPage = ({ params }: UserPageProps) => {
    const { name } = params;
    const [user, setUser] = useState<User | null>(null);
    const [selectedKeys, setSelectedKeys] = useState(new Set(['english']));
    const [selectedKeys2, setSelectedKeys2] = useState(
        new Set(['romaji_western_order'])
    );

    useEffect(() => {
        document.body.style.background = '#080808';

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/user?name=${name}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [name]);

    if (!user) return <div>Loading...</div>;

    return (
        <section className="flex justify-center items-center w-full">
            <UserCard>
                <h1 className="text-3xl font-semibold">Settings</h1>
                <PersonalInfoSection user={user} />
                <PreferencesSection
                    selectedKeys={selectedKeys}
                    selectedKeys2={selectedKeys2}
                    onTitleLanguageChange={setSelectedKeys}
                    onNameLanguageChange={setSelectedKeys2}
                />
                <DangerZoneSection />
            </UserCard>
        </section>
    );
};

export default UserPage;

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

// 'use client';

// import { User } from '@/types';
// import { Button } from '@nextui-org/button';
// import { Card, CardBody } from '@nextui-org/card';
// import { DatePicker } from '@nextui-org/date-picker';
// import { Divider } from '@nextui-org/divider';
// import {
//     Dropdown,
//     DropdownItem,
//     DropdownMenu,
//     DropdownTrigger,
// } from '@nextui-org/dropdown';
// import { Input, Textarea } from '@nextui-org/input';
// import { useEffect, useMemo, useState } from 'react';

// interface UserPageProps {
//     params: {
//         name: string; // On récupère le nom de l'utilisateur via l'URL
//     };
// }

// const UserPage = ({ params }: UserPageProps) => {
//     const { name } = params;
//     const [user, setUser] = useState<User | null>(null);
//     const [selectedKeys, setSelectedKeys] = useState(
//         new Set(['English (Attack on Titan)'])
//     );
//     const [selectedKeys2, setSelectedKeys2] = useState(
//         new Set(['Romaji, Western Order (Killua Zoldyck)'])
//     );
//     const selectedValue = useMemo(
//         () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
//         [selectedKeys]
//     );
//     const selectedValue2 = useMemo(
//         () => Array.from(selectedKeys2).join(', ').replace(/_/g, ''),
//         [selectedKeys]
//     );

//     useEffect(() => {
//         document.body.style.background = '#080808';
//         if (!name) return;

//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`/api/users/user?name=${name}`);
//                 const data = await response.json();
//                 setUser(data);
//                 console.log(data);
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };

//         fetchUser();
//     }, [name]);

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <section className="flex justify-center items-center w-full">
//             <Card className="bg-test w-1/4 p-6 border border-stone-800">
//                 <CardBody className="flex flex-col items-center gap-6">
//                     <h1 className="text-3xl font-semibold">Settings</h1>
//                     <div className="flex flex-col w-full max-w-xs gap-2 my-4">
//                         <h2 className="text-xl text-gray-400 justify-start">
//                             Personnal informations
//                         </h2>
//                         <Divider className="mb-4" />
//                         <Input
//                             size="lg"
//                             defaultValue={user.email}
//                             errorMessage="Please enter a valid email"
//                             isInvalid={false}
//                             label="Email"
//                             labelPlacement="outside"
//                             type="email"
//                             variant="bordered"
//                             description="You can change your email here"
//                             placeholder="Enter your email"
//                         />
//                         <Input
//                             className=" max-w-xs"
//                             size="lg"
//                             defaultValue={user.name}
//                             errorMessage="Please enter a valid username"
//                             isInvalid={false}
//                             label="Username"
//                             labelPlacement="outside"
//                             type="text"
//                             variant="bordered"
//                             description="You can change your username here"
//                             placeholder="Enter your username"
//                         />
//                         <Textarea
//                             className="max-w-xs"
//                             size="lg"
//                             defaultValue={user.description}
//                             errorMessage="Please enter a valid description"
//                             isInvalid={false}
//                             label="Description"
//                             labelPlacement="outside"
//                             type="text"
//                             variant="bordered"
//                             description="You can change your description here"
//                             placeholder="Enter your description"
//                         />
//                         <DatePicker
//                             showMonthAndYearPickers
//                             className="max-w-xs"
//                             size="lg"
//                             defaultValue={user.birthdate}
//                             errorMessage="Please enter a valid description"
//                             isInvalid={false}
//                             label="Birthdate"
//                             labelPlacement="outside"
//                             variant="bordered"
//                             description="You can change your birthdate here"
//                         />
//                     </div>
//                     <div className="flex flex-col gap-2 w-full max-w-xs my-4">
//                         <h2 className="text-xl text-gray-400 justify-start">
//                             Personnal preferences
//                         </h2>
//                         <Divider className="mb-4" />
//                         <p className="text-sm">Title Language</p>
//                         <Dropdown>
//                             <DropdownTrigger>
//                                 <Button
//                                     className="max-w-xs"
//                                     variant="bordered"
//                                     size="lg"
//                                 >
//                                     {selectedValue}
//                                 </Button>
//                             </DropdownTrigger>
//                             <DropdownMenu
//                                 disallowEmptySelection
//                                 label
//                                 aria-label="Single selection example"
//                                 selectedKeys={selectedKeys}
//                                 selectionMode="single"
//                                 variant="flat"
//                                 onSelectionChange={setSelectedKeys}
//                             >
//                                 <DropdownItem key="romaji">
//                                     Romaji (Shingeki no Kyojin)
//                                 </DropdownItem>
//                                 <DropdownItem key="english">
//                                     English (Attack on Titan)
//                                 </DropdownItem>
//                                 <DropdownItem key="native">
//                                     Native (進撃の巨人)
//                                 </DropdownItem>
//                             </DropdownMenu>
//                         </Dropdown>
//                         <p className="text-sm">
//                             Staff & Character Name language
//                         </p>
//                         <Dropdown>
//                             <DropdownTrigger>
//                                 <Button
//                                     className="max-w-xs"
//                                     variant="bordered"
//                                     size="lg"
//                                 >
//                                     {selectedValue2}
//                                 </Button>
//                             </DropdownTrigger>
//                             <DropdownMenu
//                                 disallowEmptySelection
//                                 label
//                                 aria-label="Single selection example"
//                                 selectedKeys={selectedKeys2}
//                                 selectionMode="single"
//                                 variant="flat"
//                                 onSelectionChange={setSelectedKeys2}
//                             >
//                                 <DropdownItem key="romaji_western_order">
//                                     Romaji, Western Order (Killua Zoldyck)
//                                 </DropdownItem>
//                                 <DropdownItem key="romaji">
//                                     Romaji (Zoldyck Killua)
//                                 </DropdownItem>
//                                 <DropdownItem key="native">
//                                     Native (キルア=ゾルディック)
//                                 </DropdownItem>
//                             </DropdownMenu>
//                         </Dropdown>
//                     </div>
//                     <div className="flex flex-col gap-2 max-w-xs my-4">
//                         <h2 className="text-xl text-gray-400 justify-start">
//                             Danger Zone
//                         </h2>
//                         <Divider className="mb-4" />
//                         <Button
//                             color="danger"
//                             variant="bordered"
//                             className="max-w-xs"
//                         >
//                             Delete my account
//                         </Button>
//                         <p className="text-gray-500 text-sm">
//                             Warning! This will permanently delete all your
//                             account data.
//                         </p>
//                     </div>
//                 </CardBody>
//             </Card>
//         </section>
//     );
// };

// export default UserPage;

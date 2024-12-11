'use client';

import CharacterSection from '@/components/CharacterSection';
import ItemGrid from '@/components/ItemGrid';
import { Staff } from '@/types/index';
import { Image } from '@nextui-org/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface StaffDetailParams {
    params: {
        id: string;
    };
}

const StaffPage = ({ params }: StaffDetailParams) => {
    const { id } = params;
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        document.body.style.background = '#121212';
        const fetchStaff = async () => {
            try {
                const response = await fetch(
                    `/api/staffs/getStaffDetails/${id}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch staff data');
                }
                const data = await response.json();
                setStaff(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [id]);

    const formatDate = (date?: {
        year?: number;
        month?: number;
        day?: number;
    }) => {
        if (!date) return 'Unknown';
        const { day, month, year } = date;
        return `${day || '??'}/${month || '??'}/${year || '????'}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!staff) return <div>No data found</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="flex">
                        <div className="flex flex-col mr-32 min-w-96">
                            <h3 className="text-xl font-semibold mb-4">
                                Details
                            </h3>
                            <div className="flex gap-8">
                                <ul className="space-y-2">
                                    <li>
                                        <p className="text-gray-400">Age</p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">Gender</p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Bloodtype
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Birthday
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Date of Death
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Hometown
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Language
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-gray-400">
                                            Occupations
                                        </p>
                                    </li>
                                </ul>
                                <ul className="space-y-2">
                                    <li>
                                        <p>{staff.age || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>{staff.gender || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>{staff.bloodType || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>{formatDate(staff.dateOfBirth)}</p>
                                    </li>
                                    <li>
                                        <p>{formatDate(staff.dateOfDeath)}</p>
                                    </li>
                                    <li>
                                        <p>{staff.homeTown || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>{staff.languageV2 || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>
                                            {staff.primaryOccupations.length > 0
                                                ? staff.primaryOccupations.join(
                                                      ', '
                                                  )
                                                : 'Unknown'}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold mb-4">
                                Description
                            </h3>
                            <p className="text-gray-400">
                                <ReactMarkdown>
                                    {staff.description ||
                                        'No description available.'}
                                </ReactMarkdown>
                            </p>
                        </div>
                    </div>
                );
            case 'appears_in':
                return (
                    <ItemGrid
                        loading={false}
                        type="animev2"
                        items={staff.staffMedia} // Utilisation directe de staffMedia
                        getName={(item) => item.title.romaji}
                        getImage={(item) => item.coverImage.large}
                        getId={(item) => item.id}
                    />
                );
            default:
                return null;
        }
    };

    // const renderContent = () => {
    //     switch (activeTab) {
    //         case 'overview':
    //             return (
    //                 <div className="flex">
    //                     {/* Details */}
    //                     <div className="flex flex-col mr-32 min-w-96">
    //                         <h3 className="text-xl font-semibold mb-4">
    //                             Details
    //                         </h3>
    //                         <div className="flex gap-8">
    //                             {/* Details fields */}
    //                         </div>
    //                     </div>
    //                     {/* Description */}
    //                     <div className="flex flex-col">
    //                         <h3 className="text-xl font-semibold mb-4">
    //                             Description
    //                         </h3>
    //                         <p className="text-gray-400">
    //                             <ReactMarkdown>
    //                                 {staff.description ||
    //                                     'No description available.'}
    //                             </ReactMarkdown>
    //                         </p>
    //                     </div>
    //                 </div>
    //             );
    // case 'appears_in':
    //     return (
    //         <ItemGrid
    //             loading={false}
    //             type="animev2"
    //             items={staff.staffMedia.edges.map(
    //                 (media) => media.node
    //             )}
    //             getName={(item) => item.title.romaji}
    //             getImage={(item) => item.coverImage.large}
    //             getId={(item) => item.id}
    //         />
    //     );
    //         default:
    //             return null;
    //     }
    // };

    return (
        <section className="p-4 mx-24">
            <div className="flex gap-4">
                <Image
                    className="mr-24"
                    alt={staff.name.full}
                    src={staff.image.large}
                />
                <div className="flex flex-col justify-center items-center gap-8">
                    <h1 className="text-4xl mt-8 font-bold text-white">
                        {staff.name.full}
                    </h1>
                    {staff.name.native && (
                        <h2 className="text-3xl font-semibold text-gray-400">
                            ({staff.name.native})
                        </h2>
                    )}
                </div>
            </div>
            <CharacterSection onTabChange={(key) => setActiveTab(key)} />
            {renderContent()}
        </section>
    );
};

export default StaffPage;

// 'use client';

// import CharacterSection from '@/components/CharacterSection';
// import ItemGrid from '@/components/ItemGrid';
// import { Image } from '@nextui-org/image';
// import { useEffect, useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// interface Staff {
//     id: number;
//     name: {
//         full: string;
//         native?: string;
//     };
//     image: {
//         large: string;
//     };
//     description: string;
//     age?: number;
//     bloodType?: string;
//     dateOfBirth?: {
//         year?: number;
//         month?: number;
//         day?: number;
//     };
//     dateOfDeath?: {
//         year?: number;
//         month?: number;
//         day?: number;
//     };
//     gender?: string;
//     homeTown?: string;
//     languageV2?: string;
//     primaryOccupations: string[];
//     staffMedia: {
//         edges: {
//             node: {
//                 id: number;
//                 title: {
//                     romaji: string;
//                     english?: string;
//                 };
//                 coverImage: {
//                     large: string;
//                 };
//             };
//         }[];
//     };
// }

// interface StaffDetailParams {
//     params: {
//         id: string;
//     };
// }

// const StaffPage = ({ params }: StaffDetailParams) => {
//     const { id } = params;
//     const [staff, setStaff] = useState<Staff | null>(null);
//     const [activeTab, setActiveTab] = useState<string>('overview');

//     useEffect(() => {
//         document.body.style.background = '#121212';
//         if (!id) return;

//         const fetchStaff = async () => {
//             const query = `
//                 query ($id: Int) {
//                     Staff(id: $id) {
//                         id
//                         name {
//                             full
//                             native
//                         }
//                         image {
//                             large
//                         }
//                         description
//                         age
//                         bloodType
//                         dateOfBirth {
//                             year
//                             month
//                             day
//                         }
//                         dateOfDeath {
//                             year
//                             month
//                             day
//                         }
//                         gender
//                         homeTown
//                         languageV2
//                         primaryOccupations
//                         staffMedia {
//                             edges {
//                                 node {
//                                     id
//                                     title {
//                                         romaji
//                                         english
//                                     }
//                                     coverImage {
//                                         large
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             `;
//             const variables = { id: parseInt(id as string, 10) };

//             try {
//                 const response = await fetch('https://graphql.anilist.co', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ query, variables }),
//                 });

//                 const { data } = await response.json();
//                 setStaff(data?.Staff || null);
//             } catch (error) {
//                 console.error('Error fetching staff data:', error);
//             }
//         };

//         fetchStaff();
//     }, [id]);

//     if (!staff) {
//         return <div>Loading...</div>;
//     }

//     const formatDate = (date?: {
//         year?: number;
//         month?: number;
//         day?: number;
//     }) => {
//         if (!date) return 'Unknown';
//         const { day, month, year } = date;
//         return `${day || '??'}/${month || '??'}/${year || '????'}`;
//     };

// const renderContent = () => {
//     switch (activeTab) {
//         case 'overview':
//             return (
//                 <div className="flex">
//                     <div className="flex flex-col mr-32 min-w-96">
//                         <h3 className="text-xl font-semibold mb-4">
//                             Details
//                         </h3>
//                         <div className="flex gap-8">
//                             <ul className="space-y-2">
//                                 <li>
//                                     <p className="text-gray-400">Age</p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">Gender</p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Bloodtype
//                                     </p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Birthday
//                                     </p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Date of Death
//                                     </p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Hometown
//                                     </p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Language
//                                     </p>
//                                 </li>
//                                 <li>
//                                     <p className="text-gray-400">
//                                         Occupations
//                                     </p>
//                                 </li>
//                             </ul>
//                             <ul className="space-y-2">
//                                 <li>
//                                     <p>{staff.age || 'Unknown'}</p>
//                                 </li>
//                                 <li>
//                                     <p>{staff.gender || 'Unknown'}</p>
//                                 </li>
//                                 <li>
//                                     <p>{staff.bloodType || 'Unknown'}</p>
//                                 </li>
//                                 <li>
//                                     <p>{formatDate(staff.dateOfBirth)}</p>
//                                 </li>
//                                 <li>
//                                     <p>{formatDate(staff.dateOfDeath)}</p>
//                                 </li>
//                                 <li>
//                                     <p>{staff.homeTown || 'Unknown'}</p>
//                                 </li>
//                                 <li>
//                                     <p>{staff.languageV2 || 'Unknown'}</p>
//                                 </li>
//                                 <li>
//                                     <p>
//                                         {staff.primaryOccupations.length > 0
//                                             ? staff.primaryOccupations.join(
//                                                   ', '
//                                               )
//                                             : 'Unknown'}
//                                     </p>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="flex flex-col">
//                         <h3 className="text-xl font-semibold mb-4">
//                             Description
//                         </h3>
//                         <p className="text-gray-400">
//                             <ReactMarkdown>
//                                 {staff.description ||
//                                     'No description available.'}
//                             </ReactMarkdown>
//                         </p>
//                     </div>
//                 </div>
//             );
//         case 'appears_in':
//             return (
//                 <ItemGrid
//                     loading={false} // Mettez `true` si les données sont encore en cours de chargement
//                     type="animev2"
//                     items={staff.staffMedia.edges.map(
//                         (media) => media.node
//                     )}
//                     getName={(item) => item.title.romaji}
//                     getImage={(item) => item.coverImage.large}
//                     getId={(item) => item.id}
//                 />
//             );
//         default:
//             return null;
//     }
// };

//     return (
//         <section className="p-4 mx-24">
//             <div className="flex gap-4">
//                 <Image
//                     className="mr-24"
//                     alt={staff.name.full}
//                     src={staff.image.large}
//                 />
//                 <div className="flex flex-col justify-center items-center gap-8">
//                     <h1 className="text-4xl mt-8 font-bold text-white">
//                         {staff.name.full}
//                     </h1>
//                     {staff.name.native && (
//                         <h2 className="text-3xl font-semibold text-gray-400">
//                             ({staff.name.native})
//                         </h2>
//                     )}
//                 </div>
//             </div>
//             <CharacterSection onTabChange={(key) => setActiveTab(key)} />
//             {renderContent()}
//         </section>
//     );
// };

// export default StaffPage;

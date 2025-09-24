'use client';

import CharacterSection from '@/components/CharacterSection';
import ItemGrid from '@/components/ItemGrid';
import { Staff } from '@/types/index';
import { Image } from "@heroui/image";
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
    const [deleting, setDeleting] = useState<boolean>(false);

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

    const handleDelete = async () => {
        if (!staff) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/staffs/deleteStaff`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: staff.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete staff');
            }

            alert('Staff deleted successfully!');
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('An error occurred while deleting the staff.');
        } finally {
            setLoading(false);
        }
    };

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
                        items={staff.staffMedia}
                        getName={(item) => item.title.romaji}
                        getImage={(item) => item.coverImage.large}
                        getId={(item) => item.id}
                    />
                );
            default:
                return null;
        }
    };

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
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Staff'}
                    </button>
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
// import { Staff } from '@/types/index';
// import { Image } from '@heroui/image';
// import { useEffect, useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// interface StaffDetailParams {
//     params: {
//         id: string;
//     };
// }

// const StaffPage = ({ params }: StaffDetailParams) => {
//     const { id } = params;
//     const [staff, setStaff] = useState<Staff | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState<string>('overview');

//     useEffect(() => {
//         document.body.style.background = '#121212';
//         const fetchStaff = async () => {
//             try {
//                 const response = await fetch(
//                     `/api/staffs/getStaffDetails/${id}`
//                 );
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch staff data');
//                 }
//                 const data = await response.json();
//                 setStaff(data);
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStaff();
//     }, [id]);

// const formatDate = (date?: {
//     year?: number;
//     month?: number;
//     day?: number;
// }) => {
//     if (!date) return 'Unknown';
//     const { day, month, year } = date;
//     return `${day || '??'}/${month || '??'}/${year || '????'}`;
// };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//     if (!staff) return <div>No data found</div>;

//     const renderContent = () => {
//         switch (activeTab) {
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
//                             <p className="text-gray-400">Age</p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">Gender</p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Bloodtype
//                             </p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Birthday
//                             </p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Date of Death
//                             </p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Hometown
//                             </p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Language
//                             </p>
//                         </li>
//                         <li>
//                             <p className="text-gray-400">
//                                 Occupations
//                             </p>
//                         </li>
//                     </ul>
//                     <ul className="space-y-2">
//                         <li>
//                             <p>{staff.age || 'Unknown'}</p>
//                         </li>
//                         <li>
//                             <p>{staff.gender || 'Unknown'}</p>
//                         </li>
//                         <li>
//                             <p>{staff.bloodType || 'Unknown'}</p>
//                         </li>
//                         <li>
//                             <p>{formatDate(staff.dateOfBirth)}</p>
//                         </li>
//                         <li>
//                             <p>{formatDate(staff.dateOfDeath)}</p>
//                         </li>
//                         <li>
//                             <p>{staff.homeTown || 'Unknown'}</p>
//                         </li>
//                         <li>
//                             <p>{staff.languageV2 || 'Unknown'}</p>
//                         </li>
//                         <li>
//                             <p>
//                                 {staff.primaryOccupations.length > 0
//                                     ? staff.primaryOccupations.join(
//                                           ', '
//                                       )
//                                     : 'Unknown'}
//                             </p>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             <div className="flex flex-col">
//                 <h3 className="text-xl font-semibold mb-4">
//                     Description
//                 </h3>
//                 <p className="text-gray-400">
//                     <ReactMarkdown>
//                         {staff.description ||
//                             'No description available.'}
//                     </ReactMarkdown>
//                 </p>
//             </div>
//         </div>
//     );
//             case 'appears_in':
//                 return (
//                     <ItemGrid
//                         loading={false}
//                         type="animev2"
//                         items={staff.staffMedia} // Utilisation directe de staffMedia
//                         getName={(item) => item.title.romaji}
//                         getImage={(item) => item.coverImage.large}
//                         getId={(item) => item.id}
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

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

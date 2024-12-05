import { useEffect, useState } from 'react';

interface Staff {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: {
        large: string;
    };
    role: string;
}

const useAnimeStaff = (animeId: number | undefined) => {
    const [staff, setStaff] = useState<Staff[] | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            if (!animeId) return;

            const query = `
                query ($id: Int) {
                    Media(id: $id) {
                        staff {
                            edges {
                                node {
                                    id
                                    name {
                                        full
                                        native
                                    }
                                    image {
                                        large
                                    }
                                }
                                role
                            }
                        }
                    }
                }
            `;
            const variables = { id: animeId };

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const { data } = await response.json();

                if (data?.Media?.staff?.edges) {
                    // Organiser le staff pour supprimer les doublons
                    const staffMap: Record<number, Staff> = {};

                    data.Media.staff.edges.forEach((edge: any) => {
                        const { id, name, image } = edge.node;
                        const { role } = edge;

                        // Si le membre du staff existe déjà dans le tableau, ajouter le rôle
                        if (staffMap[id]) {
                            staffMap[id].role = `${staffMap[id].role}, ${role}`;
                        } else {
                            // Si le membre du staff n'existe pas encore, l'ajouter
                            staffMap[id] = {
                                id,
                                name,
                                image: image.large,
                                role,
                            };
                        }
                    });

                    // Convertir le staffMap en tableau et mettre à jour l'état
                    const uniqueStaff = Object.values(staffMap);
                    setStaff(uniqueStaff);
                }
            } catch (error) {
                console.error('Failed to fetch staff:', error);
            }
        };

        fetchStaff();
    }, [animeId]);

    return staff;
};

export default useAnimeStaff;

// import { useEffect, useState } from 'react';

// interface StaffMember {
//     id: number;
//     name: {
//         full: string;
//         native?: string;
//     };
//     image: {
//         large: string;
//     };
//     role: string;
// }

// const useAnimeStaff = (animeId: number | undefined, activeTab: string) => {
//     const [staff, setStaff] = useState<StaffMember[] | null>(null);

//     useEffect(() => {
//         const fetchStaff = async () => {
//             if (!animeId || activeTab !== 'staff') return;

//             const query = `
//                 query ($id: Int) {
//                     Media(id: $id) {
//                         staff {
//                             edges {
//                                 node {
//                                     id
//                                     name {
//                                         full
//                                         native
//                                     }
//                                     image {
//                                         large
//                                     }
//                                 }
//                                 role
//                             }
//                         }
//                     }
//                 }
//             `;
//             const variables = { id: animeId };

//             try {
//                 const response = await fetch('https://graphql.anilist.co', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ query, variables }),
//                 });

//                 const { data } = await response.json();
//                 console.log(data);

//                 if (data?.Media?.staff?.edges) {
//                     const formattedStaff = data.Media.staff.edges.map(
//                         (edge: any) => ({
//                             id: edge.node.id,
//                             name: edge.node.name,
//                             image: edge.node.image?.large,
//                             role: edge.role,
//                         })
//                     );

//                     setStaff(formattedStaff);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch staff:', error);
//             }
//         };

//         fetchStaff();
//     }, [animeId, activeTab]);

//     return staff;
// };

// export default useAnimeStaff;

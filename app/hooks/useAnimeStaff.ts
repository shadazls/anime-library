import { useEffect, useState } from 'react';

interface StaffMember {
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

const useAnimeStaff = (animeId: number | undefined, activeTab: string) => {
    const [staff, setStaff] = useState<StaffMember[] | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            if (!animeId || activeTab !== 'staff') return;

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
                    const formattedStaff = data.Media.staff.edges.map(
                        (edge: any) => ({
                            id: edge.node.id,
                            name: edge.node.name,
                            image: edge.node.image?.large,
                            role: edge.role,
                        })
                    );

                    setStaff(formattedStaff);
                }
            } catch (error) {
                console.error('Failed to fetch staff:', error);
            }
        };

        fetchStaff();
    }, [animeId, activeTab]);

    return staff;
};

export default useAnimeStaff;

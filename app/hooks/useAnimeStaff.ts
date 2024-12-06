import { Anime } from '@/types';
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

const useAnimeStaff = (
    animeId: number | undefined,
    anime: any | null,
    setAnime: React.Dispatch<React.SetStateAction<Anime | null>>,
    activeTab: string
) => {
    const [staff, setStaff] = useState<Staff[] | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            if (!animeId || !anime) return;

            // Vérifie si les personnages sont déjà présents dans l'objet anime
            if (anime.staff && anime.staff.length > 0) {
                setStaff(anime.staff);
                return;
            }

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
                                image: { large: image.large },
                                role,
                            };
                        }
                    });

                    // Convertir le staffMap en tableau et mettre à jour l'état
                    const uniqueStaff = Object.values(staffMap);
                    // Ajouter les données à la base de données
                    await fetch(`/api/animes/editAnime?id=${anime._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            staff: uniqueStaff,
                        }),
                    });

                    // Mets à jour localement
                    setAnime((prev) =>
                        prev ? { ...prev, staff: uniqueStaff } : prev
                    );

                    // Mettre à jour l'état local des staff
                    setStaff(uniqueStaff);
                }
            } catch (error) {
                console.error('Failed to fetch staff:', error);
            }
        };

        fetchStaff();
    }, [animeId, anime, setAnime, activeTab]);

    return staff;
};

export default useAnimeStaff;

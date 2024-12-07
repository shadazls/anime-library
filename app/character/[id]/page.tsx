'use client';

import CharacterSection from '@/components/CharacterSection';
import ItemGrid from '@/components/ItemGrid';
import { Image } from '@nextui-org/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Character {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: {
        large: string;
    };
    description: string;
    age?: string;
    gender?: string;
    bloodType?: string;
    dateOfBirth?: {
        year?: number;
        month?: number;
        day?: number;
    };
    media: {
        edges: {
            node: {
                id: number;
                title: {
                    romaji: string;
                    english?: string;
                };
                coverImage: {
                    large: string;
                };
            };
        }[];
    };
}

interface CharacterDetailParams {
    params: {
        id: string;
    };
}

const CharacterPage = ({ params }: CharacterDetailParams) => {
    const { id } = params;
    const [character, setCharacter] = useState<Character | null>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        document.body.style.background = '#121212';
        if (!id) return;

        const fetchCharacter = async () => {
            const query = `
                query ($id: Int) {
                    Character(id: $id) {
                        id
                        name {
                            full
                            native
                        }
                        image {
                            large
                        }
                        description
                        age
                        gender
                        bloodType
                        dateOfBirth {
                            year
                            month
                            day
                        }
                        media {
                            edges {
                                node {
                                    id
                                    title {
                                        romaji
                                        english
                                    }
                                    coverImage {
                                        large
                                    }
                                }
                            }
                        }
                    }
                }
            `;
            const variables = { id: parseInt(id as string, 10) };

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const { data } = await response.json();
                setCharacter(data?.Character || null);
            } catch (error) {
                console.error('Error fetching character data:', error);
            }
        };

        fetchCharacter();
    }, [id]);

    if (!character) {
        return <div>Loading...</div>;
    }

    const formatDateOfBirth = (dob: Character['dateOfBirth']) => {
        if (!dob) return 'Unknown';
        const { day, month, year } = dob;
        return `${day || '??'}/${month || '??'}`;
    };

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
                                </ul>
                                <ul className="space-y-2">
                                    <li>
                                        <p>{character.age || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>{character.gender || 'Unknown'}</p>
                                    </li>
                                    <li>
                                        <p>
                                            {character.bloodType || 'Unknown'}
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            {formatDateOfBirth(
                                                character.dateOfBirth
                                            )}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold mb-4">
                                Description
                            </h3>
                            <div className="text-gray-400">
                                <ReactMarkdown>
                                    {character.description ||
                                        'No description available.'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                );
            case 'appears_in':
                return (
                    <ItemGrid
                        loading={false}
                        type="animev2"
                        items={character.media.edges.map((media) => media.node)}
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
                    alt={character.name.full}
                    src={character.image.large}
                    isZoomed
                />
                <div className="flex flex-col justify-center items-center gap-8">
                    <h1 className="text-4xl mt-8 font-bold text-white">
                        {character.name.full}
                    </h1>
                    {character.name.native && (
                        <h2 className="text-3xl font-semibold text-gray-400">
                            ({character.name.native})
                        </h2>
                    )}
                </div>
            </div>
            <CharacterSection onTabChange={(key) => setActiveTab(key)} />
            {renderContent()}
        </section>
    );
};

export default CharacterPage;

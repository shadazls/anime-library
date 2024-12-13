'use client';

import CharacterSection from '@/components/CharacterSection';
import ItemGrid from '@/components/ItemGrid';
import { Image } from '@nextui-org/image';
import { ObjectId } from 'mongoose';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Character {
    _id: ObjectId;
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
        id: number;
        title: {
            romaji: string;
            english?: string;
        };
        coverImage: {
            large: string;
        };
    }[];
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
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.background = '#121212';
        if (!id) return;

        const fetchCharacter = async () => {
            try {
                const response = await fetch(
                    `/api/characters/getCharacterDetails/${id}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch character');
                }
                const data = await response.json();
                setCharacter(data);
            } catch (error) {
                console.error('Error fetching character:', error);
            }
        };

        fetchCharacter();
    }, [id]);

    const handleDelete = async () => {
        if (!character) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/characters/deleteCharacter`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: character.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete character');
            }

            alert('Character deleted successfully!');
            setCharacter(null); // Efface le personnage après suppression
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting character:', error);
            alert('An error occurred while deleting the character.');
        } finally {
            setLoading(false);
        }
    };

    if (!character) {
        return <div>Loading...</div>;
    }

    const formatDateOfBirth = (dob: Character['dateOfBirth']) => {
        if (!dob) return 'Unknown';
        const { day, month } = dob;
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
                        items={character.media}
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
            <button
                onClick={handleDelete}
                disabled={loading}
                className="mt-8 p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? 'Deleting...' : 'Delete Character'}
            </button>
        </section>
    );
};

export default CharacterPage;

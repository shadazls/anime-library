import connectDB from '@/lib/db';
import Character from '@/models/Character';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();
    const { id } = params;

    try {
        // Vérifie si le personnage est dans la base
        let character = await Character.findOne({ id: parseInt(id, 10) });

        if (!character) {
            // Requête à l'API AniList
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
            const variables = { id: parseInt(id, 10) };

            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const { data } = await response.json();
            if (!data?.Character) {
                return NextResponse.json(
                    { error: 'Character not found' },
                    { status: 404 }
                );
            }

            // Formate les données pour correspondre au schéma
            character = new Character({
                id: data.Character.id,
                name: data.Character.name,
                image: data.Character.image,
                description: data.Character.description,
                age: data.Character.age,
                gender: data.Character.gender,
                bloodType: data.Character.bloodType,
                dateOfBirth: data.Character.dateOfBirth,
                media: data.Character.media.edges.map((edge: any) => ({
                    id: edge.node.id,
                    title: edge.node.title,
                    coverImage: edge.node.coverImage,
                })),
            });

            // Sauvegarde dans la base de données
            await character.save();
        }

        return NextResponse.json(character);
    } catch (error) {
        console.error('Error fetching character:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

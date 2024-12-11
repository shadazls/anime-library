import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();
    const { id } = params;

    try {
        // Vérifie si le staff est déjà dans la base de données
        let staff = await Staff.findOne({ id: parseInt(id, 10) });

        if (!staff) {
            // Requête à l'API AniList si non trouvé dans la base
            const query = `
                query ($id: Int) {
                    Staff(id: $id) {
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
                        bloodType
                        dateOfBirth {
                            year
                            month
                            day
                        }
                        dateOfDeath {
                            year
                            month
                            day
                        }
                        gender
                        homeTown
                        languageV2
                        primaryOccupations
                        staffMedia {
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

            if (!data?.Staff) {
                return NextResponse.json(
                    { error: 'Staff not found' },
                    { status: 404 }
                );
            }

            // Formate les données pour correspondre au schéma Mongoose
            staff = new Staff({
                id: data.Staff.id,
                name: data.Staff.name,
                image: data.Staff.image,
                description: data.Staff.description,
                age: data.Staff.age,
                bloodType: data.Staff.bloodType,
                dateOfBirth: data.Staff.dateOfBirth,
                dateOfDeath: data.Staff.dateOfDeath,
                gender: data.Staff.gender,
                homeTown: data.Staff.homeTown,
                languageV2: data.Staff.languageV2,
                primaryOccupations: data.Staff.primaryOccupations,
                staffMedia: data.Staff.staffMedia.edges.map((edge: any) => ({
                    id: edge.node.id,
                    title: edge.node.title,
                    coverImage: edge.node.coverImage,
                })),
            });

            // Sauvegarde dans la base de données
            await staff.save();
        }

        return NextResponse.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

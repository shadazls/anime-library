'use client';

import ItemGrid from '@/components/ItemGrid';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

const DiscoveryPage = () => {
    const [anime, setAnime] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer un animé aléatoire
    const fetchRandomAnime = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/animes/getRandomAnime');
            if (!response.ok) throw new Error('Failed to fetch anime');
            const data = await response.json();
            setAnime(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Charger un animé aléatoire au montage de la page
    useEffect(() => {
        document.body.style.background = '#121212';
        fetchRandomAnime();
    }, []);

    return (
        <section className="p-4 mx-24 flex flex-col items-center gap-8">
            <h1 className="text-6xl font-bold">Discovery</h1>
            <ItemGrid
                title="Random Animes"
                loading={loading}
                items={anime ? [anime] : []}
                getId={(item) => item._id}
                getName={(item) => item.Name || 'Unknown Anime'}
                getImage={(item) => item.image_url || ''}
                type="anime"
            />
            {anime && anime.Synopsis && (
                <div className="flex">
                    <div className="mt-4 px-6 py-4 max-w-3xl flex flex-col">
                        <h2 className="text-2xl font-semibold mb-2">
                            Synopsis
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            {anime.Synopsis}
                        </p>
                    </div>
                    <div className="mt-4 px-6 py-4 max-w-3xl flex flex-col">
                        <h2 className="text-2xl font-semibold mb-2">Genres</h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            {anime.Genres.join(', ')}
                        </p>
                    </div>
                </div>
            )}
            <Button
                onPress={fetchRandomAnime}
                className="mt-4"
                size="lg"
                variant="bordered"
            >
                Next
            </Button>
        </section>
    );
};

export default DiscoveryPage;

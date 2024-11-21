import React from "react";
import { Card, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";
import { Image } from "@nextui-org/image";

interface Anime {
  Name: string;
  image_url?: string;
}

interface AnimeGridProps {
  title?: string;
  loading: boolean;
  animes: Anime[];
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ title, loading, animes }) => {
  return (
    <div>
      {title && <h3 className="mt-4 text-2xl font-bold">{title}</h3>}
      <div className="mt-2 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center gap-16">
        {loading ? (
          new Array(6).fill(null).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="rounded-xl w-[225px] h-[320px]" />
            </div>
          ))
        ) : (
          animes.map((anime) => (
            <Card
                key={anime.Name}
                isPressable
                isHoverable
                isFooterBlurred
                radius="lg"
                className="border-none"
            >
                <Image
                    width={225}
                    height={320}
                    alt={`Image of ${anime.Name}`}
                    src={anime.image_url || "https://via.placeholder.com/225"}
                    isZoomed
                />
                <CardHeader className="absolute justify-end">
                    {/* Boutons supplémentaires peuvent être ajoutés ici */}
                </CardHeader>
                <CardFooter className="absolute bg-black/30 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-center">
                    <p className="text-small text-white/70">{anime.Name}</p>
                </CardFooter>
                {/* <CardFooter className="absolute bg-black/20 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col">
                        <p className="text-small text-white/60">{anime.Name}</p>
                    </div>
                    </div>
                </CardFooter> */}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnimeGrid;

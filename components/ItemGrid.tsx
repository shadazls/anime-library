import React from "react";
import { Card, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";
import { Image } from "@nextui-org/image";

interface Item {
  [key: string]: any; // Rendre les champs flexibles pour différents types d'éléments (animes, mangas, etc.)
}

interface ItemGridProps {
  title?: string; // Titre optionnel
  loading: boolean;
  items: Item[]; // Liste d'éléments (animes ou mangas)
  getName: (item: Item) => string; // Fonction pour récupérer le nom de l'élément
  getImage: (item: Item) => string; // Fonction pour récupérer l'URL de l'image
}

const ItemGrid: React.FC<ItemGridProps> = ({ title, loading, items, getName, getImage }) => {
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
          items.map((item) => (
            <Card
              key={getName(item)}
              isPressable
              isHoverable
              isFooterBlurred
              radius="lg"
              className="border-none"
            >
              <Image
                width={225}
                height={320}
                alt={`Image of ${getName(item)}`}
                src={getImage(item) || "https://via.placeholder.com/225"}
                isZoomed
              />
              <CardHeader className="absolute justify-end">
                {/* Boutons supplémentaires peuvent être ajoutés ici */}
              </CardHeader>
              <CardFooter className="absolute bg-black/30 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex justify-center">
                <p className="text-small text-white/70">{getName(item)}</p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemGrid;
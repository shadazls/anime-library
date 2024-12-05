import BookmarkIcon from '@/components/BookmarkIcon';
import CheckIcon from '@/components/CheckIcon';
import EyeRegularIcon from '@/components/EyeRegularIcon';
import PlayIcon from '@/components/PlayIcon';
import StarIcon from '@/components/StarIcon';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';

interface AnimeInfoProps {
    animeName: string;
    animeScore: number;
    animeImageUrl: string;
    onTrailerClick: () => void;
}

const AnimeInfo = ({
    animeName,
    animeScore,
    animeImageUrl,
    onTrailerClick,
}: AnimeInfoProps) => {
    return (
        <div className="flex justify-start gap-4">
            <Image
                className="mr-24"
                alt={`Image of ${animeName}`}
                src={animeImageUrl || 'https://via.placeholder.com/225'}
                isZoomed
            />
            <div className="flex flex-col gap-4 w-full">
                <Button
                    className="text-sm font-medium text-black bg-white self-end"
                    variant="flat"
                    radius="sm"
                    startContent={<PlayIcon />}
                    onPress={onTrailerClick}
                >
                    Watch trailer
                </Button>

                <h1 className="text-4xl mt-8 font-bold text-white">
                    {animeName}
                </h1>
                <div className="flex gap-2 items-center">
                    <StarIcon fill="#7d7d7d" />
                    <p>{animeScore}</p>
                </div>

                <div className="flex mt-4 gap-4 w-full">
                    <Button
                        className="text-sm font-medium text-white bg-default-100"
                        variant="flat"
                        radius="sm"
                        startContent={<EyeRegularIcon />}
                    >
                        Watching
                    </Button>
                    <Button
                        className="text-sm font-medium text-white bg-default-100"
                        variant="flat"
                        radius="sm"
                        startContent={<BookmarkIcon />}
                    >
                        To Watch
                    </Button>
                    <Button
                        className="text-sm font-medium text-white bg-default-100"
                        variant="flat"
                        radius="sm"
                        startContent={<CheckIcon />}
                    >
                        Watched
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AnimeInfo;

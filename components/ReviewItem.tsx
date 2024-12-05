import { Avatar } from '@nextui-org/avatar';
import { useState } from 'react';

interface Review {
    id: number;
    summary: string;
    body: string;
    score: number;
    user: {
        name: string;
        avatar: string;
    };
}

const ReviewItem = ({ review }: { review: Review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxBodyLength = 200; // Nombre de caractères à afficher avant de tronquer

    const toggleBody = () => setIsExpanded((prev) => !prev);

    const renderBody = () => {
        if (isExpanded || review.body.length <= maxBodyLength) {
            return review.body;
        }

        return `${review.body.slice(0, maxBodyLength)}... `;
    };

    return (
        <>
            <div className="flex gap-4 mb-16">
                <div className="flex-shrink-0">
                    <Avatar
                        src={review.user.avatar}
                        showFallback
                        name={review.user.name}
                        size="lg"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <h4 className="font-bold">{review.user.name}</h4>
                        <p className="text-gray-500">
                            Score: {review.score}/100
                        </p>
                    </div>
                    <h3 className="font-semibold mb-2">{review.summary}</h3>
                    <p className="text-gray-400">
                        {renderBody()}
                        {review.body.length > maxBodyLength && (
                            <button
                                onClick={toggleBody}
                                className="text-blue-400 hover:underline"
                            >
                                {isExpanded ? 'moins' : 'plus'}
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ReviewItem;

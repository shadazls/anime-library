import { Review } from '@/types';
import { Avatar } from '@nextui-org/avatar';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ReviewItemProps {
    review: Review;
    animeId: string | undefined; // Ajouté pour passer l'ID de l'anime
    onDelete: (reviewId: number) => void;
}

const ReviewItem = ({ review, animeId, onDelete }: ReviewItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxBodyLength = 200;

    const toggleBody = () => setIsExpanded((prev) => !prev);

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `/api/animes/reviews/deleteReview?anime_id=${animeId}&review_id=${review.id}`,
                { method: 'DELETE' }
            );
            if (!response.ok) throw new Error('Failed to delete review');
            onDelete(review.id); // Notifie le parent pour mettre à jour la liste
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const renderBody = () => {
        if (isExpanded || review.body.length <= maxBodyLength) {
            return <ReactMarkdown>{review.body}</ReactMarkdown>;
        }

        const truncatedBody = review.body.slice(0, maxBodyLength);
        return (
            <>
                <ReactMarkdown>{`${truncatedBody}...`}</ReactMarkdown>
                <button
                    onClick={toggleBody}
                    className="text-blue-400 hover:underline"
                >
                    {isExpanded ? 'moins' : 'plus'}
                </button>
            </>
        );
    };

    return (
        <div className="flex gap-4 mb-16">
            <div className="flex-shrink-0">
                <Avatar
                    src={review.user.avatar}
                    showFallback
                    name={review.user.name}
                    size="lg"
                />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <h4 className="font-bold">{review.user.name}</h4>
                        <p className="text-gray-500">
                            Score: {review.score}/100
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
                <h3 className="font-semibold mb-2">{review.summary}</h3>
                <div className="text-gray-400">{renderBody()}</div>
            </div>
        </div>
    );
};

export default ReviewItem;

// import { Review } from '@/types';
// import { Avatar } from '@nextui-org/avatar';
// import { useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// const ReviewItem = ({ review }: { review: Review }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const maxBodyLength = 200; // Nombre de caractères à afficher avant de tronquer

//     const toggleBody = () => setIsExpanded((prev) => !prev);

//     const renderBody = () => {
//         if (isExpanded || review.body.length <= maxBodyLength) {
//             return <ReactMarkdown>{review.body}</ReactMarkdown>;
//         }

//         // Tronquer le contenu et le rendre sous forme de Markdown
//         const truncatedBody = review.body.slice(0, maxBodyLength);
//         return (
//             <>
//                 <ReactMarkdown>{`${truncatedBody}...`}</ReactMarkdown>
//                 <button
//                     onClick={toggleBody}
//                     className="text-blue-400 hover:underline"
//                 >
//                     {isExpanded ? 'moins' : 'plus'}
//                 </button>
//             </>
//         );
//     };

//     return (
//         <div className="flex gap-4 mb-16">
//             <div className="flex-shrink-0">
//                 <Avatar
//                     src={review.user.avatar}
//                     showFallback
//                     name={review.user.name}
//                     size="lg"
//                 />
//             </div>
//             <div className="flex flex-col gap-2">
//                 <div className="flex gap-4">
//                     <h4 className="font-bold">{review.user.name}</h4>
//                     <p className="text-gray-500">Score: {review.score}/100</p>
//                 </div>
//                 <h3 className="font-semibold mb-2">{review.summary}</h3>
//                 <div className="text-gray-400">{renderBody()}</div>
//             </div>
//         </div>
//     );
// };

// export default ReviewItem;

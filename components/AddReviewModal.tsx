'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/modal";
import { Button, Input, Textarea } from "@heroui/react";
import { useState } from 'react';

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    animeId: string; // ID de l'animé
    onSuccess: () => void; // Callback à appeler après une sauvegarde réussie
}

const AddReviewModal = ({
    isOpen,
    onClose,
    animeId,
    onSuccess,
}: AddReviewModalProps) => {
    const [summary, setSummary] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [score, setScore] = useState<number | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        if (!score || score < 1 || score > 10) {
            setError('Score must be between 1 and 10');
            setLoading(false);
            return;
        }

        try {
            // const token = localStorage.getItem('token'); // Récupérer le token
            // if (!token) {
            //     setError('You must be logged in to submit a review.');
            //     console.log('You must be logged in to submit a review.');
            //     setLoading(false);
            //     return;
            // }

            const response = await fetch(`/api/animes/reviews/addNewReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    anime_id: animeId,
                    review: {
                        score,
                        summary,
                        body,
                    },
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Failed to save review');
            }

            // Reset form and close modal on success
            setSummary('');
            setBody('');
            setScore('');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            closeButton
            isOpen={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
        >
            <ModalContent>
                <ModalHeader className="flex justify-center">
                    <h3 id="modal-title">Add a Review</h3>
                </ModalHeader>
                <ModalBody>
                    {error && <p className="text-danger">{error}</p>}
                    <Input
                        aria-label="Review Score"
                        type="number"
                        value={score.toString()}
                        onChange={(e) => setScore(Number(e.target.value))}
                        placeholder="Score (1-10)"
                        min={1}
                        max={10}
                    />
                    <Textarea
                        aria-label="Review Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        fullWidth
                        minRows={2}
                        placeholder="Write a brief summary..."
                    />
                    <Textarea
                        aria-label="Review Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        fullWidth
                        minRows={6}
                        placeholder="Write your full review..."
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} disabled={loading}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        isLoading={loading}
                    >
                        Save Review
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddReviewModal;

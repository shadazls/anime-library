'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/modal';
import { Button, Textarea } from '@nextui-org/react';
import { useState } from 'react';

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (review: string) => void;
}

const AddReviewModal = ({ isOpen, onClose, onSave }: AddReviewModalProps) => {
    const [review, setReview] = useState<string>('');

    const handleSave = () => {
        onSave(review);
        setReview(''); // Clear the review after saving
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
                    <h3 id="modal-title">Add a Review?</h3>
                </ModalHeader>
                <ModalBody>
                    <Textarea
                        aria-label="Write your review here"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        fullWidth
                        minRows={6}
                        placeholder="Write your review..."
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={handleSave}>Save Review</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddReviewModal;

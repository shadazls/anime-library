'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/modal';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';

interface AddCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    animeId: string; // ID de l'animé
    onSuccess: (newCharacter: any) => void; // Callback pour mettre à jour les personnages
}

const AddCharacterModal = ({
    isOpen,
    onClose,
    animeId,
    onSuccess,
}: AddCharacterModalProps) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/animes/characters/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    anime_id: animeId,
                    character: {
                        name,
                        description,
                        image,
                        age,
                        gender,
                    },
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Failed to add character');
            }

            const newCharacter = await response.json();
            onSuccess(newCharacter); // Ajouter le personnage au state
            onClose(); // Fermer le modal
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
                    <h3 id="modal-title">Add a Character</h3>
                </ModalHeader>
                <ModalBody>
                    {error && <p className="text-danger">{error}</p>}
                    <Input
                        aria-label="Character Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Character Name"
                    />
                    <Textarea
                        aria-label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Character Description"
                    />
                    <Input
                        aria-label="Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Image URL"
                    />
                    <Input
                        aria-label="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                    />
                    <Input
                        aria-label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Gender"
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
                        Save Character
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddCharacterModal;

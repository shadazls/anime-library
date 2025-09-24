import { Modal, ModalContent } from "@heroui/modal";

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    trailerUrl: string | null;
}

const TrailerModal = ({ isOpen, onClose, trailerUrl }: TrailerModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            size="5xl"
            onOpenChange={onClose}
            placement="top-center"
            backdrop="blur"
        >
            <ModalContent>
                {trailerUrl && (
                    <iframe
                        className="w-full h-[48rem] rounded-lg"
                        src={trailerUrl}
                        title="Anime Trailer"
                        allowFullScreen
                    />
                )}
            </ModalContent>
        </Modal>
    );
};

export default TrailerModal;

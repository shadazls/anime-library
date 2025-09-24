import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string;
}

const ErrorModal = ({ isOpen, onClose, errorMessage }: ErrorModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="lg"
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                <ModalHeader>
                    <h3 className="text-xl font-semibold text-red-500">
                        Error
                    </h3>
                </ModalHeader>
                <ModalBody>
                    <p className="">{errorMessage}</p>
                    <div className="flex justify-end mt-4">
                        <Button color="danger" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ErrorModal;

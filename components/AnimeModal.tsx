import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface AnimeModalProps {
  isOpen: boolean;
  onClose: () => void; // Fonction pour fermer le modal
  onSubmit: (data: AnimeFormData) => void; // Fonction pour soumettre les données
  mode: "add" | "edit"; // Indique si le modal est en mode ajout ou édition
}

interface AnimeFormData {
  Name: string;
  image_url: string;
  english_name?: string;
  other_name?: string;
  Synopsis?: string;
  Genres?: string;
  Score?: number;
  Type?: string;
  Episodes?: number;
  Aired?: string;
  Premiered?: string;
  Status?: string;
  Producers?: string;
  Licensors?: string;
  Studios?: string;
  Source?: string;
  Duration?: string;
}

const AnimeModal: React.FC<AnimeModalProps> = ({ isOpen, onClose, onSubmit, mode }) => {
  const [formData, setFormData] = useState<AnimeFormData>({
    Name: "",
    image_url: "",
    english_name: "",
    other_name: "",
    Synopsis: "",
    Genres: "",
    Score: undefined,
    Type: "",
    Episodes: undefined,
    Aired: "",
    Premiered: "",
    Status: "",
    Producers: "",
    Licensors: "",
    Studios: "",
    Source: "",
    Duration: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Gère les changements dans les champs
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Soumission des données
  const handleSubmit = () => {
    if (!formData.Name || !formData.image_url) {
      setErrorMessage("Name and Image URL are required.");
      return;
    }
    onSubmit(formData); // Appelle la fonction parent avec les données
    onClose(); // Ferme le modal
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {mode === "add" ? "Add Anime" : "Edit Anime"}
        </ModalHeader>
        <ModalBody className="overflow-auto" style={{ maxHeight: "70vh" }}>
          {/* Champs principaux */}
          <Input
            autoFocus
            label="Name"
            placeholder="Enter the name of the anime"
            variant="bordered"
            isRequired
            value={formData.Name}
            onValueChange={(value) => handleFormChange("Name", value)}
          />
          <Input
            label="Image URL"
            placeholder="Enter the URL for the anime's image"
            variant="bordered"
            isRequired
            value={formData.image_url}
            onValueChange={(value) => handleFormChange("image_url", value)}
          />
          <Input
            label="English name"
            placeholder="Enter the English name of the anime"
            variant="bordered"
            value={formData.english_name}
            onValueChange={(value) => handleFormChange("english_name", value)}
          />
          <Input
            label="Other name"
            placeholder="Enter the other name of the anime"
            variant="bordered"
            value={formData.other_name}
            onValueChange={(value) => handleFormChange("other_name", value)}
          />
          <Textarea
            label="Synopsis"
            placeholder="Enter the synopsis"
            variant="bordered"
            value={formData.Synopsis}
            onValueChange={(value) => handleFormChange("Synopsis", value)}
          />
          <Input
            label="Genres"
            placeholder="Enter the genres (e.g., Action, Sci-Fi)"
            variant="bordered"
            value={formData.Genres}
            onValueChange={(value) => handleFormChange("Genres", value)}
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          {/* Bouton pour afficher ou cacher les champs avancés */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}
          </button>

          {/* Champs avancés */}
          {showAdvanced && (
            <div className="flex flex-col gap-3" style={{ marginTop: "1rem" }}>
              <Input
                label="Score"
                type="number"
                placeholder="Enter the score (e.g., 8.75)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Score", value)}
              />
              <Input
                label="Type"
                placeholder="Enter the type (e.g., TV, Movie)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Type", value)}
              />
              <Input
                label="Episodes"
                type="number"
                placeholder="Enter the number of episodes"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Episodes", value)}
              />
              <Input
                label="Aired"
                placeholder="Enter the aired dates (e.g., Apr 3, 1998 to Apr 24, 1999)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Aired", value)}
              />
              <Input
                label="Premiered"
                placeholder="Enter the season and year (e.g., Spring 1998)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Premiered", value)}
              />
              <Input
                label="Status"
                placeholder="Enter the status (e.g., Finished Airing)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Status", value)}
              />
              <Input
                label="Producers"
                placeholder="Enter the producers (e.g., Bandai Visual)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Producers", value)}
              />
              <Input
                label="Licensors"
                placeholder="Enter the licensors (e.g., Funimation)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Licensors", value)}
              />
              <Input
                label="Studios"
                placeholder="Enter the studios (e.g., Sunrise)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Studios", value)}
              />
              <Input
                label="Source"
                placeholder="Enter the source (e.g., Original, Manga)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Source", value)}
              />
              <Input
                label="Duration"
                placeholder="Enter the duration (e.g., 24 min per ep)"
                variant="bordered"
                onValueChange={(value) => handleFormChange("Duration", value)}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnimeModal;

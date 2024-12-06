import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Anime } from "@/app/animeCatalog/page"; // Remplacez par le chemin correct de l'interface

interface AnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Anime>) => void;
  mode: "add" | "edit";
  initialData?: Partial<Anime>; // Données initiales pour pré-remplir en mode édition
}

const AnimeModal: React.FC<AnimeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}) => {
  const defaultFormData: Partial<Anime> = {
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
  };

  const [formData, setFormData] = useState<Partial<Anime>>(defaultFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pré-remplir les champs avec `initialData` ou réinitialiser
  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log("Initial data received by AnimeModal:", initialData); // Ajoutez ce log
      setFormData({ ...defaultFormData, ...initialData });
    } else if (mode === "add") {
      console.log("Switching to add mode, resetting form."); // Ajoutez ce log
      setFormData(defaultFormData);
    }
  }, [mode, initialData]);

  // Gestion des changements dans les champs du formulaire
  const handleFormChange = (field: keyof Anime, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation et soumission des données
  const handleSubmit = () => {
    if (!formData.Name || !formData.image_url) {
      setErrorMessage("Name and Image URL are required.");
      return;
    }
    onSubmit(formData); // Envoie les données au parent
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
            value={formData.Name || ""}
            onValueChange={(value) => handleFormChange("Name", value)}
          />
          <Input
            label="Image URL"
            placeholder="Enter the URL for the anime's image"
            variant="bordered"
            isRequired
            value={formData.image_url || ""}
            onValueChange={(value) => handleFormChange("image_url", value)}
          />
          <Input
            label="English Name"
            placeholder="Enter the English name of the anime"
            variant="bordered"
            value={formData.english_name || ""}
            onValueChange={(value) => handleFormChange("english_name", value)}
          />
          <Input
            label="Other Name"
            placeholder="Enter the other name of the anime"
            variant="bordered"
            value={formData.other_name || ""}
            onValueChange={(value) => handleFormChange("other_name", value)}
          />
          <Textarea
            label="Synopsis"
            placeholder="Enter the synopsis"
            variant="bordered"
            value={formData.Synopsis || ""}
            onValueChange={(value) => handleFormChange("Synopsis", value)}
          />
          <Input
            label="Genres"
            placeholder="Enter the genres (e.g., Action, Sci-Fi)"
            variant="bordered"
            value={formData.Genres || ""}
            onValueChange={(value) => handleFormChange("Genres", value)}
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          {/* Bouton pour afficher ou cacher les champs avancés */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}
          </button>

          {/* Champs avancés */}
          {showAdvanced && (
            <div className="flex flex-col gap-3 mt-4">
              <Input
                label="Score"
                type="number"
                placeholder="Enter the score"
                variant="bordered"
                value={formData.Score !== undefined ? String(formData.Score) : ""}
                onValueChange={(value) => handleFormChange("Score", Number(value))}
              />
              <Input
                label="Type"
                placeholder="Enter the type (e.g., TV, Movie)"
                variant="bordered"
                value={formData.Type || ""}
                onValueChange={(value) => handleFormChange("Type", value)}
              />
              <Input
                label="Episodes"
                type="number"
                placeholder="Enter the number of episodes"
                variant="bordered"
                value={formData.Episodes !== undefined ? String(formData.Episodes) : ""}
                onValueChange={(value) => handleFormChange("Episodes", Number(value))}
              />
              <Input
                label="Aired"
                placeholder="Enter aired dates (e.g., Jan 2020 to Mar 2020)"
                variant="bordered"
                value={formData.Aired || ""}
                onValueChange={(value) => handleFormChange("Aired", value)}
              />
              <Input
                label="Premiered"
                placeholder="Enter the premiered season (e.g., Spring 2020)"
                variant="bordered"
                value={formData.Premiered || ""}
                onValueChange={(value) => handleFormChange("Premiered", value)}
              />
              <Input
                label="Status"
                placeholder="Enter the status (e.g., Finished Airing)"
                variant="bordered"
                value={formData.Status || ""}
                onValueChange={(value) => handleFormChange("Status", value)}
              />
              <Input
                label="Producers"
                placeholder="Enter the producers (e.g., Sunrise)"
                variant="bordered"
                value={formData.Producers || ""}
                onValueChange={(value) => handleFormChange("Producers", value)}
              />
              <Input
                label="Licensors"
                placeholder="Enter the licensors (e.g., Funimation)"
                variant="bordered"
                value={formData.Licensors || ""}
                onValueChange={(value) => handleFormChange("Licensors", value)}
              />
              <Input
                label="Studios"
                placeholder="Enter the studios (e.g., Madhouse)"
                variant="bordered"
                value={formData.Studios || ""}
                onValueChange={(value) => handleFormChange("Studios", value)}
              />
              <Input
                label="Source"
                placeholder="Enter the source material (e.g., Manga)"
                variant="bordered"
                value={formData.Source || ""}
                onValueChange={(value) => handleFormChange("Source", value)}
              />
              <Input
                label="Duration"
                placeholder="Enter the duration (e.g., 24 min per ep)"
                variant="bordered"
                value={formData.Duration || ""}
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

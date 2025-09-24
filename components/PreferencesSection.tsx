import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/dropdown";

interface PreferencesSectionProps {
    selectedKeys: Set<string>;
    selectedKeys2: Set<string>;
    onTitleLanguageChange: (keys: Set<string>) => void;
    onNameLanguageChange: (keys: Set<string>) => void;
}

const PreferencesSection = ({
    selectedKeys,
    selectedKeys2,
    onTitleLanguageChange,
    onNameLanguageChange,
}: PreferencesSectionProps) => (
    <div className="flex flex-col gap-2 w-full max-w-xs my-4">
        <h2 className="text-xl text-gray-400 justify-start">Preferences</h2>
        <Divider className="mb-4" />
        <p className="text-sm">Title Language</p>
        <Dropdown>
            <DropdownTrigger>
                <Button className="max-w-xs" variant="bordered" size="lg">
                    {Array.from(selectedKeys).join(', ')}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={onTitleLanguageChange}
            >
                <DropdownItem key="romaji">
                    Romaji (Shingeki no Kyojin)
                </DropdownItem>
                <DropdownItem key="english">
                    English (Attack on Titan)
                </DropdownItem>
                <DropdownItem key="native">Native (進撃の巨人)</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <p className="text-sm">Staff & Character Name Language</p>
        <Dropdown>
            <DropdownTrigger>
                <Button className="max-w-xs" variant="bordered" size="lg">
                    {Array.from(selectedKeys2).join(', ')}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                selectedKeys={selectedKeys2}
                selectionMode="single"
                onSelectionChange={onNameLanguageChange}
            >
                <DropdownItem key="romaji_western_order">
                    Romaji, Western Order (Killua Zoldyck)
                </DropdownItem>
                <DropdownItem key="romaji">
                    Romaji (Zoldyck Killua)
                </DropdownItem>
                <DropdownItem key="native">
                    Native (キルア=ゾルディック)
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
);

export default PreferencesSection;

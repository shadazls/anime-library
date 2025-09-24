import { Tab, Tabs } from "@heroui/tabs";
import { Key } from 'react';

const CharacterSection = ({
    onTabChange,
}: {
    onTabChange: (key: string) => void;
}) => {
    const handleTabChange = (key: Key) => {
        if (typeof key === 'string') {
            onTabChange(key);
        }
    };

    return (
        <Tabs
            className="my-16 text-8xl"
            size="lg"
            aria-label="Display"
            variant="underlined"
            disabledKeys={['stats']}
            onSelectionChange={handleTabChange}
        >
            <Tab key="overview" title="Overview" />
            <Tab key="appears_in" title="Appears In" />
        </Tabs>
    );
};

export default CharacterSection;

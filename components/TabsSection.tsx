import { Tab, Tabs } from "@heroui/tabs";
import { Key } from 'react';

const TabsSection = ({
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
            <Tab key="watch" title="Watch" />
            <Tab key="relations" title="Relations" />
            <Tab key="characters" title="Characters" />
            <Tab key="staff" title="Staff" />
            <Tab key="reviews" title="Reviews" />
            <Tab key="stats" title="Stats" />
        </Tabs>
    );
};

export default TabsSection;

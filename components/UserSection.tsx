import { Tab, Tabs } from '@nextui-org/tabs';
import { Key } from 'react';

const UserSection = ({
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
            <Tab key="watching" title="Watching" />
            <Tab key="to_watch" title="To Watch" />
            <Tab key="watched" title="Watched" />
            <Tab key="abandoned" title="Abandonned" />
            <Tab key="rewatching" title="Rewatching" />
        </Tabs>
    );
};

export default UserSection;

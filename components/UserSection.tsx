import { Tab, Tabs } from '@nextui-org/tabs';
import { Key } from 'react';
import BookmarkIcon from './BookmarkIcon';
import CheckIcon from './CheckIcon';
import EyeRegularIcon from './EyeRegularIcon';

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
            <Tab
                key="watching"
                title={
                    <div className="flex items-center space-x-2">
                        <EyeRegularIcon />
                        <span>Watching</span>
                    </div>
                }
            />
            <Tab
                key="to_watch"
                title={
                    <div className="flex items-center space-x-2">
                        <BookmarkIcon />
                        <span>To Watch</span>
                    </div>
                }
            />
            <Tab
                key="watched"
                title={
                    <div className="flex items-center space-x-2">
                        <CheckIcon />
                        <span>Watched</span>
                    </div>
                }
            />
            <Tab key="abandoned" title="Abandonned" />
            <Tab key="rewatching" title="Rewatching" />
        </Tabs>
    );
};

export default UserSection;

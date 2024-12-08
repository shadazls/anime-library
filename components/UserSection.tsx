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
            className="my-16"
            size="lg"
            aria-label="Display"
            variant="underlined"
            disabledKeys={['stats']}
            onSelectionChange={handleTabChange}
        >
            <Tab
                key="watching"
                className="text-xl p-6"
                title={
                    <div className="flex items-center space-x-2">
                        <EyeRegularIcon />
                        <span>Watching</span>
                    </div>
                }
            />
            <Tab
                key="to_watch"
                className="text-xl p-6"
                title={
                    <div className="flex items-center space-x-2">
                        <BookmarkIcon />
                        <span>To Watch</span>
                    </div>
                }
            />
            <Tab
                key="watched"
                className="text-xl p-6"
                title={
                    <div className="flex items-center space-x-2">
                        <CheckIcon />
                        <span>Watched</span>
                    </div>
                }
            />
            <Tab key="abandoned" title="Abandonned" className="text-xl p-6" />
            <Tab key="rewatching" title="Rewatching" className="text-xl p-6" />
        </Tabs>
    );
};

export default UserSection;

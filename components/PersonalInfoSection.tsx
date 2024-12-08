import { User } from '@/types';
import { DatePicker } from '@nextui-org/date-picker';
import { Divider } from '@nextui-org/divider';
import { Input, Textarea } from '@nextui-org/input';
import { useState } from 'react';

interface PersonalInfoSectionProps {
    user: User;
}

const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

    return (
        <div className="flex flex-col w-full max-w-xs gap-2 my-4">
            <h2 className="text-xl text-gray-400 justify-start">
                Personal Information
            </h2>
            <Divider className="mb-4" />
            <Input
                size="lg"
                defaultValue={user.email}
                label="Email"
                labelPlacement="outside"
                type="email"
                variant="bordered"
                placeholder="Enter your email"
            />
            <Input
                size="lg"
                defaultValue={user.name}
                label="Username"
                labelPlacement="outside"
                type="text"
                variant="bordered"
                placeholder="Enter your username"
            />
            <Textarea
                size="lg"
                defaultValue={user.description}
                label="Description"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Enter your description"
            />
            <DatePicker
                showMonthAndYearPickers
                size="lg"
                defaultValue={user.birthdate}
                label="Birthdate"
                labelPlacement="outside"
                variant="bordered"
            />
            <Input
                size="lg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                label="Avatar URL"
                labelPlacement="outside"
                type="url"
                variant="bordered"
                placeholder="Enter image URL"
            />
            {avatarUrl && (
                <div className="flex justify-center mt-4">
                    <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-full border border-stone-800 object-cover"
                        onError={() =>
                            setAvatarUrl(
                                'https://via.placeholder.com/96?text=Invalid+URL'
                            )
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default PersonalInfoSection;

import { User } from '@/types';
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import { useState } from 'react';

interface PersonalInfoSectionProps {
    user: User;
}

const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
    const [email, setEmail] = useState(user.email || '');
    const [username, setUsername] = useState(user.name || '');
    const [description, setDescription] = useState(user.description || '');
    const [birthdate, setBirthdate] = useState(user.birthdate || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdateUser = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/users/editUser?id=${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: username,
                    description,
                    birthdate,
                    avatar: avatarUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const data = await response.json();
            console.log('User updated successfully:', data);
            alert('User updated successfully!');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('An error occurred while updating the user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-xs gap-2 my-4">
            <h2 className="text-xl text-gray-400 justify-start">
                Personal Information
            </h2>
            <Divider className="mb-4" />
            <Input
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                labelPlacement="outside"
                type="email"
                variant="bordered"
                placeholder="Enter your email"
            />
            <Input
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                labelPlacement="outside"
                type="text"
                variant="bordered"
                placeholder="Enter your username"
            />
            <Textarea
                size="lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Enter your description"
            />
            {/* <DatePicker
                showMonthAndYearPickers
                size="lg"
                value={birthdate.toDate()}
                onChange={(date) => setBirthdate(date || '')}
                label="Birthdate"
                labelPlacement="outside"
                variant="bordered"
            /> */}
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
            <Button
                className="mt-4"
                color="primary"
                isLoading={isSubmitting}
                onClick={handleUpdateUser}
            >
                Update User
            </Button>
        </div>
    );
};

export default PersonalInfoSection;

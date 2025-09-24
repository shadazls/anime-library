import { Card, CardBody } from "@heroui/card";

interface UserCardProps {
    children: React.ReactNode;
}

const UserCard = ({ children }: UserCardProps) => (
    <Card className="bg-test w-1/4 p-6 border border-stone-800">
        <CardBody className="flex flex-col items-center gap-6">
            {children}
        </CardBody>
    </Card>
);

export default UserCard;

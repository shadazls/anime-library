import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

const DangerZoneSection = () => (
    <div className="flex flex-col gap-2 max-w-xs my-4">
        <h2 className="text-xl text-gray-400 justify-start">Danger Zone</h2>
        <Divider className="mb-4" />
        <Button color="danger" variant="bordered" className="max-w-xs">
            Delete my account
        </Button>
        <p className="text-gray-500 text-sm">
            Warning! This will permanently delete all your account data.
        </p>
    </div>
);

export default DangerZoneSection;

'use client';

import EditIcon from '@/components/EditIcon';
import EyeRegularIcon from '@/components/EyeRegularIcon';
import TrashIcon from '@/components/TrashIcon';
import { Chip } from "@heroui/chip";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useCallback, useEffect, useState } from 'react';

export const columns = [
    { name: 'NAME', uid: 'name' },
    { name: 'EMAIL', uid: 'email' },
    { name: 'STATUS', uid: 'status' },
    { name: 'BIRTHDATE', uid: 'birthdate' },
    { name: 'ACTIONS', uid: 'actions' },
];

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    // Récupérer les utilisateurs via l'API
    useEffect(() => {
        document.body.style.background = '#121212';
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/getAllUsers');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <User
                        avatarProps={{ radius: 'lg', src: user.avatar }}
                        description={user.email}
                        name={user.name}
                    />
                );
            case 'email':
                return <p>{user.email}</p>;
            case 'status':
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.status] || 'default'}
                        size="sm"
                        variant="flat"
                    >
                        {user.status || 'N/A'}
                    </Chip>
                );
            case 'birthdate':
                return (
                    <p>
                        {user.birthdate
                            ? new Date(user.birthdate).toLocaleDateString()
                            : 'N/A'}
                    </p>
                );
            case 'actions':
                return (
                    <div className="relative flex justify-center items-center gap-4">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeRegularIcon height="24" width="24" />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <TrashIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <section className="p-4 mx-24 flex flex-col items-center gap-8">
            <h1 className="text-6xl font-bold">User list</h1>
            <Table aria-label="User table">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === 'actions' ? 'center' : 'start'
                            }
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={users}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </section>
    );
};

export default UsersPage;

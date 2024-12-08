'use client';

import EyeRegularIcon from '@/components/EyeRegularIcon';
import EyeSlashRegularIcon from '@/components/EyeSlashRegularIcon';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useRouter } from 'next/navigation'; // Pour redirection
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter(); // Hook pour redirection

    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        document.body.style.background = '#080808';
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Données à envoyer
        const credentials = { email: username, password };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const message = await response.text();
                setErrorMessage(message); // Afficher l'erreur si la connexion échoue
                return;
            }

            // Si tout va bien, rediriger l'utilisateur vers la page principale
            router.push('/'); // Redirection vers la page principale
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('An error occurred, please try again.');
        }
    };

    return (
        <section className="flex justify-center items-center mx-24 p-4">
            <Card className="bg-test w-1/4 p-6 border border-stone-800">
                <CardBody className="flex flex-col items-center gap-6">
                    <h1 className="text-3xl font-semibold">Log In</h1>
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            type="text"
                            label="Email/Username"
                            labelPlacement="outside"
                            variant="bordered"
                            description="Enter your email/username"
                            placeholder="Enter your email/username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="max-w-xs"
                        />
                        <Input
                            type={isVisible ? 'text' : 'password'}
                            label="Password"
                            labelPlacement="outside"
                            variant="bordered"
                            description="Enter your password"
                            placeholder="Choose your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label="toggle password visibility"
                                >
                                    {isVisible ? (
                                        <EyeSlashRegularIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeRegularIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            className="max-w-xs"
                        />
                        <Button
                            type="submit"
                            className="text-sm font-medium text-black bg-white"
                            variant="flat"
                            radius="sm"
                        >
                            Log In
                        </Button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <Link href="/register" color="success">
                            Sign Up
                        </Link>
                    </p>
                </CardBody>
            </Card>
        </section>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Card, CardBody } from "@nextui-org/card";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/EyeSlashFilledIcon";
import { useRouter } from "next/navigation"; // Pour redirection
import EyeRegularIcon from "@/components/EyeRegularIcon";
import EyeSlashRegularIcon from "@/components/EyeSlashRegularIcon";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter(); // Hook pour redirection

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    document.body.style.background = "#080808";
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Réinitialiser le message d'erreur
      setErrorMessage("");

      // Appeler la route `/api/auth/register`
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: username }),
      });

      if (response.ok) {
        // Redirection vers la page principale en cas de succès
        router.push("/");
      } else {
        // Gérer les erreurs de la route
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to register.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <section className="flex justify-center items-center absolute inset-0">
      <Card className="bg-test w-1/4 p-6 border border-stone-800">
        <CardBody className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-semibold">Create An Account</h1>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              variant="bordered"
              description="Enter your email address"
              placeholder="your.email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="text"
              label="Username"
              labelPlacement="outside"
              variant="bordered"
              description="Enter your username"
              placeholder="YourUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type={isVisible ? "text" : "password"}
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
              Sign Up
            </Button>
          </form>
          <p>Already have an account? <Link href="/login" color="success">Log In</Link></p>
        </CardBody>
      </Card>
    </section>
  );
}

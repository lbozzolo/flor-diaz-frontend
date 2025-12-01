"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, email, password);
      router.push("/"); // Redirect to home or dashboard
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrarse");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Branding/Image */}
      <div className="hidden md:flex flex-col justify-between bg-accent text-black p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="text-4xl font-bold font-display uppercase tracking-tighter">
            Flor<br />Dance
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-6xl font-display uppercase tracking-tighter leading-none mb-6">
            Únete al<br />movimiento
          </h2>
          <p className="text-black/70 max-w-md text-lg font-medium">
            Crea tu cuenta hoy y empieza a aprender con las mejores coreografías.
          </p>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
          <div className="absolute bottom-1/4 left-0 w-96 h-96 border border-black rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <Link href="/" className="md:hidden inline-flex items-center text-sm font-bold uppercase tracking-widest mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold font-display uppercase tracking-tight mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Completa tus datos para registrarte.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-bold uppercase tracking-wider">Nombre de Usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex h-12 w-full rounded-none border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="flex h-12 w-full rounded-none border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold uppercase tracking-wider">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-12 w-full rounded-none border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 bg-black text-white hover:bg-accent hover:text-black border border-black rounded-none uppercase tracking-widest font-bold transition-all">
              Registrarse
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-dashed border-gray-300">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-black font-bold uppercase tracking-wider hover:underline ml-1">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b border-black">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tighter uppercase font-display">Flor Díaz</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/clases" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                            Clases
                        </Link>
                        <Link href="/#beneficios" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                            Beneficios
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:text-accent transition-colors" aria-label="Carrito">
                        <ShoppingCart className="h-6 w-6" />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/mi-cuenta" className="p-2 hover:text-accent transition-colors" aria-label="Mi Cuenta">
                                <User className="h-6 w-6" />
                            </Link>
                            <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar Sesión" className="hover:text-accent">
                                <LogOut className="h-6 w-6" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 hover:text-accent transition-colors" aria-label="Iniciar Sesión">
                            <User className="h-6 w-6" />
                        </Link>
                    )}

                    <button className="md:hidden p-2 hover:text-accent transition-colors">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}

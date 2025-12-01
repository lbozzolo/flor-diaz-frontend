"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2, User, LogOut } from "lucide-react";
import { getYouTubeThumbnail } from "@/lib/utils";

console.log("DEBUG: getYouTubeThumbnail function:", getYouTubeThumbnail);

interface PurchasedClase {
    id: number;
    documentId: string;
    titulo: string;
    slug: string;
    id_video_preview?: string;
    id_video_externo?: string;
    thumbnail?: {
        url: string;
    };
}

export default function MyAccountPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [purchases, setPurchases] = useState<PurchasedClase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && user.purchased_clases) {
            // Map the user's purchased classes to the component state
            // Deduplicate by documentId (or slug) because Strapi might return multiple versions (draft/published) with different IDs
            const uniquePurchases = user.purchased_clases.filter((clase: any, index: number, self: any[]) =>
                index === self.findIndex((c) => (c.documentId && c.documentId === clase.documentId) || c.slug === clase.slug)
            );

            setPurchases(uniquePurchases as unknown as PurchasedClase[]);
            setLoading(false);
        } else if (user) {
            setLoading(false);
        }
    }, [user]);

    if (authLoading || (loading && user)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black bg-muted py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tighter mb-2">
                            Mi Cuenta
                        </h1>
                        <p className="text-muted-foreground font-medium">Bienvenida de nuevo, {user.username}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="rounded-none border-black hover:bg-black hover:text-white uppercase tracking-wider font-bold"
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Profile Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="border border-black p-6 bg-white">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black">
                                <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider">Usuario</p>
                                    <p className="font-bold text-lg">{user.username}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Miembro desde</p>
                                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Purchases */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-6 flex items-center gap-2">
                            <PlayCircle className="h-6 w-6" /> Mis Clases
                        </h2>

                        {purchases.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {purchases.map((item) => (
                                    <Card key={item.id} className="group hover:border-accent transition-colors duration-300">
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden border-b border-black">
                                            {item.thumbnail?.url ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.thumbnail.url}`}
                                                    alt={item.titulo}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (getYouTubeThumbnail(item.id_video_preview || item.id_video_externo || "") ? (
                                                <img
                                                    src={getYouTubeThumbnail(item.id_video_preview || item.id_video_externo || "")!}
                                                    alt={item.titulo}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">
                                                    <PlayCircle className="h-12 w-12" />
                                                </div>
                                            ))}
                                        </div>
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-lg font-display uppercase tracking-tight">{item.titulo}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="p-4 pt-0">
                                            <Button size="sm" className="w-full rounded-none bg-black text-white hover:bg-accent hover:text-black border border-black uppercase tracking-wider font-bold" asChild>
                                                <Link href={`/watch/${item.slug}`}>
                                                    Ver Clase
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border border-dashed border-black bg-gray-50">
                                <p className="text-xl font-display uppercase text-muted-foreground mb-4">Aún no tienes clases</p>
                                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Explora nuestro catálogo y empieza a bailar hoy mismo.</p>
                                <Button asChild className="rounded-none bg-black text-white hover:bg-accent hover:text-black border border-black uppercase tracking-wider font-bold h-12 px-8">
                                    <Link href="/clases">Explorar Catálogo</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

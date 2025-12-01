"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Lock, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { extractTextFromBlocks } from "@/lib/utils";

interface Choreography {
    id: number;
    documentId: string;
    titulo: string;
    descripcion: any[];
    link: string;
    slug: string;
    id_video_externo?: string;
}

// Helper to extract YouTube ID from various URL formats
function getYouTubeId(url: string | undefined): string | null {
    if (!url) return null;
    const cleanUrl = url.trim();
    console.log("DEBUG: Processing video URL:", cleanUrl);

    // If it's already an ID (11 chars, alphanumeric + - _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
        return cleanUrl;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [choreography, setChoreography] = useState<Choreography | null>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login?redirect=/watch/${slug}`);
        }
    }, [user, authLoading, router, slug]);

    useEffect(() => {
        const checkAccessAndFetch = async () => {
            if (!user) return;

            try {
                // 1. Fetch Choreography Details
                const choreoData = await fetchAPI("/clases", {
                    filters: { slug: slug },
                });

                if (!choreoData?.data?.[0]) {
                    setLoading(false);
                    return;
                }

                // Assuming the API now returns a flattened structure directly
                const rawData = choreoData.data[0];
                const choreo = {
                    id: rawData.id,
                    documentId: rawData.documentId,
                    titulo: rawData.titulo,
                    descripcion: rawData.descripcion,
                    link: rawData.link,
                    slug: rawData.slug,
                    id_video_externo: rawData.id_video_externo,
                };
                console.log("DEBUG: Fetched choreography:", choreo);
                setChoreography(choreo);

                // 2. Check Access
                // Verify if the user has purchased this specific class
                // Check by slug OR documentId to be safe against versioning issues
                const userHasPurchased = user.purchased_clases?.some(
                    (purchasedClase: any) =>
                        purchasedClase.slug === slug ||
                        (purchasedClase.documentId && purchasedClase.documentId === choreo.documentId)
                );

                setHasAccess(!!userHasPurchased);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            checkAccessAndFetch();
        }
    }, [user, slug]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!choreography) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Coreografía no encontrada</h1>
                <Button asChild>
                    <Link href="/clases">Volver al catálogo</Link>
                </Button>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Contenido Bloqueado</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    No tienes acceso a esta clase. Para ver el contenido, necesitas adquirir la coreografía <strong>{choreography.titulo}</strong>.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                        <Link href="/clases">Explorar más</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/clases/${slug}`}>Ver Detalles de Compra</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const videoId = getYouTubeId(choreography.id_video_externo);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{choreography.titulo}</h1>
                    <Link href="/mi-cuenta" className="text-sm text-muted-foreground hover:underline">
                        &larr; Volver a mis clases
                    </Link>
                </div>

                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8 relative group">
                    {/* Video Player */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {videoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={choreography.titulo}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="text-white text-center p-4">
                                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>Video no disponible o enlace inválido.</p>
                                <p className="text-xs text-gray-400 mt-2">URL: {choreography.link || "No definida"}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                    <h3>Sobre esta clase</h3>
                    <p>{extractTextFromBlocks(choreography.descripcion)}</p>
                    {/* Add more content tabs: Resources, Comments, etc. */}
                </div>
            </div>
        </div>
    );
}

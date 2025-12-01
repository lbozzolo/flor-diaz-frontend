"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/strapi";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight, Loader2 } from "lucide-react";
import { extractTextFromBlocks, cn, getYouTubeThumbnail } from "@/lib/utils";

interface Clase {
    id: number;
    documentId: string;
    titulo: string;
    descripcion: any[];
    precio: number;
    slug: string;
    thumbnail: {
        url: string;
    };
    nivel?: string;
    id_video_externo?: string;
}

const LEVELS = ["Todos", "Principiante", "Intermedio", "Avanzado"];

export default function ClasesPage() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState("Todos");

    useEffect(() => {
        const getClases = async () => {
            try {
                const data = await fetchAPI("/clases", {
                    populate: "*",
                    sort: ["createdAt:desc"],
                });
                setClases(data?.data || []);
            } catch (error) {
                console.error("Error fetching clases:", error);
            } finally {
                setLoading(false);
            }
        };

        getClases();
    }, []);

    const filteredClases = selectedLevel === "Todos"
        ? clases
        : clases.filter(clase => clase.nivel === selectedLevel);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b border-black py-20 bg-muted">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter mb-6">
                        Catálogo
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                        Explora nuestra colección completa. Desde ritmos latinos hasta contemporáneo, encuentra tu próxima clase.
                    </p>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {LEVELS.map((level) => (
                            <Button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                variant={selectedLevel === level ? "default" : "outline"}
                                className={cn(
                                    "rounded-none uppercase tracking-wider font-bold border-black",
                                    selectedLevel === level
                                        ? "bg-black text-white hover:bg-black/90"
                                        : "bg-transparent text-black hover:bg-black hover:text-white"
                                )}
                            >
                                {level}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-black" />
                    </div>
                ) : filteredClases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClases.map((item: Clase) => (
                            <Card key={item.id} className="group hover:border-accent transition-colors duration-300 flex flex-col h-full">
                                <Link href={`/clases/${item.slug}`} className="block aspect-[4/3] bg-gray-100 relative overflow-hidden border-b border-black">
                                    {(item.id_video_externo && getYouTubeThumbnail(item.id_video_externo)) || item.thumbnail?.url ? (
                                        <img
                                            src={
                                                (item.id_video_externo && getYouTubeThumbnail(item.id_video_externo)) ||
                                                `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.thumbnail?.url}`
                                            }
                                            alt={item.titulo}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <PlayCircle className="h-16 w-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
                                        ${item.precio}
                                    </div>
                                    {item.nivel && (
                                        <div className="absolute bottom-4 left-4 bg-white text-black border border-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                            {item.nivel}
                                        </div>
                                    )}
                                </Link>
                                <CardHeader className="pt-8 pb-4">
                                    <CardTitle className="text-2xl font-display uppercase tracking-tight group-hover:text-accent transition-colors">
                                        <Link href={`/clases/${item.slug}`}>
                                            {item.titulo}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                        {extractTextFromBlocks(item.descripcion) || "Sin descripción disponible."}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-4 pb-8 border-t border-dashed border-gray-300 mt-auto">
                                    <Link
                                        href={`/clases/${item.slug}`}
                                        className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors group/link"
                                    >
                                        Ver Detalle
                                        <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-black">
                        <p className="text-2xl font-display uppercase text-muted-foreground mb-4">No hay clases disponibles</p>
                        <p className="text-muted-foreground">Intenta cambiar el filtro o vuelve más tarde.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAPI } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { PlayCircle, Check, ArrowLeft, Clock, BarChart, Music } from "lucide-react";
import { extractTextFromBlocks, getYouTubeThumbnail } from "@/lib/utils";

async function getClaseBySlug(slug: string) {
    try {
        const data = await fetchAPI("/clases", {
            filters: {
                slug: {
                    $eq: slug,
                },
            },
            populate: "*",
        }, { cache: 'no-store' });
        return data?.data?.[0] || null;
    } catch (error) {
        console.error("Error fetching clase:", error);
        return null;
    }
}

export default async function ClaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const clase = await getClaseBySlug(slug);

    console.log("DEBUG: Slug:", slug);
    console.log("DEBUG: Clase ID:", clase?.id);
    console.log("DEBUG: Video ID:", clase?.id_video_externo);
    console.log("DEBUG: Thumbnail URL:", clase?.id_video_externo ? getYouTubeThumbnail(clase.id_video_externo) : "No ID");

    if (!clase) {
        notFound();
    }

    const { titulo, descripcion, precio, thumbnail, nivel, id_video_externo, id_video_preview, duracion } = clase;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb / Back Navigation */}
            <div className="border-b border-black bg-muted py-4">
                <div className="container mx-auto px-4">
                    <Link href="/clases" className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Media & Description (8 cols) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Main Video/Image Area */}
                        <div className="aspect-video bg-black relative border border-black overflow-hidden group">
                            {id_video_preview ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${id_video_preview}`}
                                    title={`Preview de ${titulo}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (id_video_externo && getYouTubeThumbnail(id_video_externo)) || thumbnail?.url ? (
                                <img
                                    src={
                                        (id_video_externo && getYouTubeThumbnail(id_video_externo)) ||
                                        `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${thumbnail?.url}`
                                    }
                                    alt={titulo}
                                    className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <PlayCircle className="h-24 w-24 opacity-50" />
                                </div>
                            )}

                            {/* Play Button Overlay (Only if NO preview video) */}
                            {!id_video_preview && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-full group-hover:scale-110 transition-transform duration-300">
                                        <PlayCircle className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-3xl font-bold font-display uppercase tracking-tight border-b border-black pb-4 mb-6">
                                Sobre esta clase
                            </h2>
                            <div className="text-muted-foreground leading-relaxed">
                                <p>{extractTextFromBlocks(descripcion) || "Sin descripción detallada disponible."}</p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-black">
                            <div className="border border-black p-6 text-center">
                                <Clock className="h-8 w-8 mx-auto mb-4" />
                                <h3 className="font-bold uppercase tracking-wider mb-2">Duración</h3>
                                <p className="text-sm text-muted-foreground">{duracion ? `${duracion} Minutos` : "Consultar"}</p>
                            </div>
                            <div className="border border-black p-6 text-center">
                                <BarChart className="h-8 w-8 mx-auto mb-4" />
                                <h3 className="font-bold uppercase tracking-wider mb-2">Nivel</h3>
                                <p className="text-sm text-muted-foreground">{nivel || "Todos los niveles"}</p>
                            </div>
                            <div className="border border-black p-6 text-center">
                                <Music className="h-8 w-8 mx-auto mb-4" />
                                <h3 className="font-bold uppercase tracking-wider mb-2">Estilo</h3>
                                <p className="text-sm text-muted-foreground">Urbano / Pop</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Purchase Card (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="border border-black bg-white p-8 space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold font-display uppercase tracking-tighter mb-4 leading-none">
                                    {titulo}
                                </h1>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-bold">${precio}</span>
                                    <span className="text-sm text-muted-foreground uppercase tracking-wider">ARS</span>
                                </div>
                                <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                                    <Check className="h-4 w-4" /> Acceso inmediato y de por vida
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-dashed border-gray-300">
                                <h3 className="font-bold uppercase tracking-wider text-sm">Lo que aprenderás:</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-black shrink-0" />
                                        <span>Técnica paso a paso</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-black shrink-0" />
                                        <span>Musicalidad y ritmo</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-black shrink-0" />
                                        <span>Performance y expresión</span>
                                    </li>
                                </ul>
                            </div>

                            <Button size="lg" className="w-full h-14 text-lg bg-black text-white hover:bg-accent hover:text-black border border-black rounded-none uppercase tracking-widest font-bold transition-all" asChild>
                                <Link href={`/checkout?product=${slug}`}>
                                    Comprar Clase
                                </Link>
                            </Button>

                            <p className="text-xs text-center text-muted-foreground pt-4">
                                Compra segura procesada por Mercado Pago.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

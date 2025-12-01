import Link from "next/link";
import { fetchAPI } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, ArrowRight, Star, Zap, Users } from "lucide-react";
import { extractTextFromBlocks, getYouTubeThumbnail } from "@/lib/utils";

// Define types locally for now, or import from a types file
interface Clase {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: any[]; // Blocks
  precio: number;
  slug: string;
  thumbnail: {
    url: string;
  };
  nivel?: string;
  id_video_externo?: string;
}

async function getFeaturedClases() {
  try {
    const data = await fetchAPI("/clases", {
      populate: "*",
      pagination: {
        limit: 3,
      },
      sort: ["createdAt:desc"],
    });
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching featured clases:", error);
    return [];
  }
}

export default async function Home() {
  const featuredClases = await getFeaturedClases();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center border-b border-black overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-9xl md:text-[13rem] font-black font-display tracking-tighter mb-8 leading-[0.8]">
              Clases online
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Domina el arte del movimiento. Clases exclusivas, tutoriales paso a paso y una comunidad apasionada.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-black text-white hover:bg-accent hover:text-black border border-black rounded-none h-14 px-8 text-lg uppercase tracking-wider font-bold transition-all" asChild>
                <Link href="/clases">Ver Clases</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-black border-black hover:bg-black hover:text-white rounded-none h-14 px-8 text-lg uppercase tracking-wider font-bold transition-all" asChild>
                <Link href="#beneficios">Conocer más</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-black rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-64 h-64 border border-black rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 border border-black rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black pb-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tighter mb-4">Clases Destacadas</h2>
              <p className="text-lg text-muted-foreground">Las clases más populares del mes.</p>
            </div>
            <Link href="/clases" className="hidden md:flex items-center gap-2 text-lg font-bold uppercase tracking-wide hover:text-accent transition-colors group">
              Ver todo el catálogo <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredClases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredClases.map((item: Clase) => (
                <Card key={item.id} className="group hover:border-accent transition-colors duration-300">
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
                  <CardHeader className="pt-8">
                    <CardTitle className="text-2xl font-display uppercase tracking-tight group-hover:text-accent transition-colors">
                      <Link href={`/clases/${item.slug}`}>
                        {item.titulo}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {extractTextFromBlocks(item.descripcion) || "Sin descripción disponible."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 pb-8">
                    <Link href={`/clases/${item.slug}`} className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-accent hover:border-accent transition-colors">
                      Ver Detalles
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-gray-300">
              <p className="text-muted-foreground mb-6 text-lg">No se encontraron clases destacadas.</p>
              <Button variant="outline" className="rounded-none border-black uppercase tracking-wider" asChild>
                <Link href="/clases">Explorar catálogo</Link>
              </Button>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/clases" className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-wide hover:text-accent transition-colors">
              Ver todo el catálogo <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-muted border-y border-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black">
            <div className="bg-white p-12 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center mb-8">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase mb-4">Ritmo Propio</h3>
              <p className="text-muted-foreground leading-relaxed">Acceso ilimitado 24/7. Repite los pasos las veces que necesites sin presiones.</p>
            </div>
            <div className="bg-white p-12 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center mb-8">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase mb-4">Calidad HD</h3>
              <p className="text-muted-foreground leading-relaxed">Videos en alta definición con múltiples ángulos y explicaciones claras.</p>
            </div>
            <div className="bg-white p-12 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center mb-8">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase mb-4">Comunidad</h3>
              <p className="text-muted-foreground leading-relaxed">Únete a miles de estudiantes apasionados y comparte tu progreso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-8xl font-bold font-display uppercase tracking-tighter mb-8">
            ¿Lista para<br />bailar?
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            Únete hoy y accede a contenido exclusivo que llevará tu baile al siguiente nivel.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-accent hover:text-white border-none rounded-none h-16 px-12 text-xl uppercase tracking-widest font-bold transition-all" asChild>
            <Link href="/register">Crear Cuenta Gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

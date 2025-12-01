"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Cookies from "js-cookie";
import { getYouTubeThumbnail } from "@/lib/utils";

// Initialize Mercado Pago
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'TEST-00000000-0000-0000-0000-000000000000');

interface Choreography {
    id: number;
    documentId: string;
    titulo: string;
    precio: number;
    slug: string;
    id_video_preview?: string;
    id_video_externo?: string;
    thumbnail: {
        url: string;
    };
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const productSlug = searchParams.get("product");
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState<Choreography | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            // Redirect to login if not authenticated, preserving the return url
            router.push(`/login?redirect=/checkout?product=${productSlug}`);
        }
    }, [user, authLoading, router, productSlug]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productSlug) return;

            try {
                const data = await fetchAPI("/clases", {
                    filters: { slug: productSlug },
                    populate: "thumbnail",
                });

                if (data?.data?.[0]) {
                    const rawProduct = data.data[0];
                    console.log("DEBUG: Raw product data:", rawProduct);

                    const productData = {
                        id: rawProduct.id,
                        documentId: rawProduct.documentId,
                        titulo: rawProduct.titulo,
                        precio: rawProduct.precio,
                        slug: rawProduct.slug,
                        id_video_preview: rawProduct.id_video_preview,
                        id_video_externo: rawProduct.id_video_externo,
                        thumbnail: {
                            url: rawProduct.thumbnail?.url || '',
                        },
                    };
                    setProduct(productData);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productSlug]);

    const createPreference = async () => {
        if (!product || !user) return;
        setProcessing(true);

        try {
            console.log("DEBUG: Creating preference for product:", product);
            // Call Strapi backend to create the preference
            const token = Cookies.get("token");
            const payload = {
                claseId: product.documentId,
            };
            console.log("DEBUG: Sending payload:", payload);

            const response = await fetchAPI("/payment/preference", {}, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.sessionId) {
                setPreferenceId(response.sessionId);
            } else {
                throw new Error("No preference ID returned");
            }

        } catch (error) {
            console.error("Error creating preference:", error);
            alert("Error al iniciar el pago");
        } finally {
            setProcessing(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <Button onClick={() => router.push("/clases")}>Volver al catálogo</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-24 w-36 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative">
                                {(product.id_video_preview && getYouTubeThumbnail(product.id_video_preview)) || (product.id_video_externo && getYouTubeThumbnail(product.id_video_externo)) || product.thumbnail?.url ? (
                                    <img
                                        src={
                                            (product.id_video_preview && getYouTubeThumbnail(product.id_video_preview)) ||
                                            (product.id_video_externo && getYouTubeThumbnail(product.id_video_externo)) ||
                                            `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${product.thumbnail.url}`
                                        }
                                        alt={product.titulo}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Loader2 className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{product.titulo}</h3>
                                <p className="text-sm text-muted-foreground">Acceso ilimitado</p>
                            </div>
                        </div>
                        <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>${product.precio}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pago con Mercado Pago</CardTitle>
                        <CardDescription>Paga de forma segura con tarjeta, efectivo o dinero en cuenta.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col items-center justify-center min-h-[200px]">
                        {preferenceId ? (
                            <Wallet initialization={{ preferenceId: preferenceId }} />
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-muted-foreground">Haz clic abajo para iniciar el pago.</p>
                                <Button
                                    className="w-full text-lg h-12 bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={createPreference}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                        </>
                                    ) : (
                                        `Pagar $${product.precio} con Mercado Pago`
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

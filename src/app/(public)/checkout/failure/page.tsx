import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutFailurePage() {
    return (
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Error en el Pago</h1>
            <p className="text-muted-foreground mb-8 text-lg">
                Lo sentimos, hubo un problema al procesar tu pago. No se ha realizado ningún cargo.
                Por favor, intenta nuevamente o utiliza otro método de pago.
            </p>
            <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                    <Link href="/clases">Volver al Catálogo</Link>
                </Button>
                <Button asChild>
                    <Link href="/checkout">Intentar Nuevamente</Link>
                </Button>
            </div>
        </div>
    );
}

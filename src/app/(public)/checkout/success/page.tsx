import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
            <p className="text-muted-foreground mb-8 text-lg">
                Gracias por tu compra. Ya tienes acceso ilimitado a tu nueva coreografía.
                Hemos enviado un recibo a tu correo electrónico.
            </p>
            <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                    <Link href="/">Volver al Inicio</Link>
                </Button>
                <Button asChild>
                    <Link href="/mi-cuenta">Ir a Mis Clases</Link>
                </Button>
            </div>
        </div>
    );
}

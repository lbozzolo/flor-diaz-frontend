import Link from "next/link";
import { Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-black bg-background pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <h3 className="text-4xl font-bold font-display uppercase mb-6 tracking-tighter">Flor Díaz</h3>
                        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                            Aprende las coreografías más impactantes desde la comodidad de tu hogar. Pasión y técnica en cada paso.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Explorar</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/" className="hover:text-accent transition-colors">Inicio</Link></li>
                            <li><Link href="/clases" className="hover:text-accent transition-colors">Clases</Link></li>
                            <li><Link href="/mi-cuenta" className="hover:text-accent transition-colors">Mi Cuenta</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Social</h3>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-accent transition-colors">
                                <Instagram className="h-6 w-6" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="hover:text-accent transition-colors">
                                <Youtube className="h-6 w-6" />
                                <span className="sr-only">YouTube</span>
                            </a>
                            <a href="mailto:contacto@flordance.com" className="hover:text-accent transition-colors">
                                <Mail className="h-6 w-6" />
                                <span className="sr-only">Email</span>
                            </a>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-medium">contacto@flordance.com</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-black pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Flor Díaz. Todos los derechos reservados.</p>
                    <div className="mt-4 md:mt-0 space-x-8">
                        <Link href="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
                        <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

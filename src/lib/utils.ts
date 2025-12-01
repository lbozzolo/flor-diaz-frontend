import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function extractTextFromBlocks(blocks: any[]): string {
    if (!Array.isArray(blocks)) return "";
    return blocks
        .map((block) => {
            if (block.type === "paragraph" || block.type === "heading") {
                return block.children?.map((child: any) => child.text).join("") || "";
            }
            return "";
        })
        .join("\n");
}

export function getYouTubeThumbnail(urlOrId: string): string | null {
    if (!urlOrId) return null;
    urlOrId = urlOrId.trim();

    // If it's a simple ID (11 chars, no special URL chars), use it directly
    if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('?')) {
        return `https://img.youtube.com/vi/${urlOrId}/maxresdefault.jpg`;
    }

    // Otherwise try to extract from URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11)
        ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
        : null;
}

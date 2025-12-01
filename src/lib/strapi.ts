import qs from "qs";

/**
 * Get the Strapi URL from environment variables
 */
export function getStrapiURL(path = "") {
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param path The API path (e.g. /api/posts)
 * @param urlParamsObject URL parameters object, will be stringified
 * @param options Options passed to fetch
 * @returns Parsed API response
 */
export async function fetchAPI(
    path: string,
    urlParamsObject = {},
    options = {}
) {
    let requestUrl = "";
    try {
        // Merge default and user options
        const mergedOptions = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options as RequestInit).headers,
            },
        };

        // Build request URL
        const queryString = qs.stringify(urlParamsObject);
        requestUrl = `${getStrapiURL(
            `/api${path}`
        )}${queryString ? `?${queryString}` : ""}`;

        // Trigger API call
        console.log("DEBUG: Fetching URL:", requestUrl);
        const response = await fetch(requestUrl, mergedOptions);

        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || response.statusText;
            console.error(`Error fetching ${requestUrl}:`, errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch API Error:", error);
        if (error instanceof Error) {
            throw new Error(
                `Connection failed: ${error.message}. URL: ${requestUrl}`
            );
        }
        throw new Error(
            `Please check if your server is running and you set all the environment variables.`
        );
    }
}

// Types for Strapi Responses
export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export type StrapiData<T> = T & {
    id: number;
    documentId: string;
    [key: string]: any;
};

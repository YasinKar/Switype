export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_BASE_API_URL,
    headers: {
        accept: 'application/json',
        Authorization: `Api-Key ${process.env.EXPO_PUBLIC_BACKEND_API_KEY}`
    }
}

export const fetchLanguages = async () => {
    const endpoint = `${API_CONFIG.BASE_URL}v1/languages`
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error("failed to fetch languages", response.statusText);
    }

    const data = await response.json()

    return data
}

export const fetchWords = async ({ langCode, page }: { langCode: string, page: number }) => {
    const endpoint = `${API_CONFIG.BASE_URL}v1/languages/${langCode}/words?per_page=5&page=${page}`
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error("failed to fetch words", response.statusText);
    }

    const data = await response.json()

    return data
}

export const fetchSettings = async () => {
    const endpoint = `${API_CONFIG.BASE_URL}site/v1/settings`
    const response = await fetch(endpoint, {
        method: 'GET'
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error("failed to fetch settings", response.statusText);
    }

    const data = await response.json()

    return data
}
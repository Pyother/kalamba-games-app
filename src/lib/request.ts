const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000/api";

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Token ${token}` } : {}),
        },
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

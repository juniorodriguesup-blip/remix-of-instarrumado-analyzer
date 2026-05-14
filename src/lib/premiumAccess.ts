const STORAGE_KEY = "instarrumado_premium_token";

export function getPremiumToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setPremiumToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearPremiumToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasPremiumAccess(): boolean {
  return !!getPremiumToken();
}

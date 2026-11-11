export interface CheckoutProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  notes: string;
  savedAt: string;
}

const KEY = "feelings-checkout-profile-v1";

export function loadCheckoutProfile(
  accountEmail?: string | null,
): CheckoutProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw) as CheckoutProfile;
    if (!profile?.name || !profile?.phone || !profile?.address || !profile?.city) {
      return null;
    }
    if (
      accountEmail &&
      profile.email &&
      profile.email.toLowerCase() !== accountEmail.toLowerCase()
    ) {
      return null;
    }
    return profile;
  } catch {
    return null;
  }
}

export function saveCheckoutProfile(
  profile: Omit<CheckoutProfile, "savedAt">,
): void {
  if (typeof window === "undefined") return;
  const next: CheckoutProfile = {
    ...profile,
    email: profile.email.trim().toLowerCase(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
}

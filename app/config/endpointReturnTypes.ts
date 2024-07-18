

type PasswordHashingReturnType = { status: 'failed' | 'success', errorObj?: object | string, error: string | null, passwordHash?: string };
export type { PasswordHashingReturnType }
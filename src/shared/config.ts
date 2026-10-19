function requireEnv(name: keyof ImportMetaEnv): string {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(`Missing env variable ${name}. Copy .env.example to .env (see README).`);
    }
    return value;
}

// lazy, so tests (which never hit the network) don't depend on .env
export const appConfig = {
    get apiBase() {
        return requireEnv('VITE_API_BASE');
    },
};

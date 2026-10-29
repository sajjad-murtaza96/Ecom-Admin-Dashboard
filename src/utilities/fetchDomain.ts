import { Origin, Req } from './http';

export const getProtocolAndHost = (
    requestHeaders: Pick<Headers, "get">,
): { protocol: string; host: string } => {
    const host = requestHeaders.get("host");
    if (!host) {
        throw new Error("Unable to determine the request host.");
    }
    const protocol =
        requestHeaders.get("x-forwarded-proto") ??
        (process.env.NODE_ENV === "development" ? "http" : "https");

    return { protocol, host };
};

export const getOriginFromRequest = (req: Req): Origin => {
    const host = req?.headers?.host || '';
    const protocol =
        host.startsWith('localhost') || host.startsWith('127.0.0.1')
            ? 'http://'
            : 'https://';

    return `${protocol}${host}`;
};

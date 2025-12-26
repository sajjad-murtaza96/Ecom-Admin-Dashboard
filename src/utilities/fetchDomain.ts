import { Origin, Req } from './http';

export const getOriginFromRequest = (req: Req): Origin => {
    const host = req?.headers?.host || '';
    const protocol =
        host.startsWith('localhost') || host.startsWith('127.0.0.1')
            ? 'http://'
            : 'https://';

    return `${protocol}${host}`;
};

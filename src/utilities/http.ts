import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type UrlProtocol = string;

export type Origin = string;

export type Url = string;

export type Req =
    | NextApiRequest
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
    });

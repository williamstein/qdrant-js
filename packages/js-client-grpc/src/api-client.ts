import {Transport, Interceptor, createPromiseClient, PromiseClient} from '@bufbuild/connect';
import {createGrpcTransport, compressionGzip} from '@bufbuild/connect-node';
import {Collections} from './proto/collections_service_connect.js';
import {Points} from './proto/points_service_connect.js';
import {Snapshots} from './proto/snapshots_service_connect.js';
import {Qdrant} from './proto/qdrant_connect.js';
import {QdrantClientTimeoutError} from './errors.js';

type Clients = {
    collections: PromiseClient<typeof Collections>;
    points: PromiseClient<typeof Points>;
    snapshots: PromiseClient<typeof Snapshots>;
    service: PromiseClient<typeof Qdrant>;
};

export type GrpcClients = Readonly<Clients>;

function createClients(transport: Transport) {
    let collections: Clients['collections'] | undefined;
    let points: Clients['points'] | undefined;
    let snapshots: Clients['snapshots'] | undefined;
    let service: Clients['service'] | undefined;
    return {
        get collections() {
            if (!collections) {
                collections = createPromiseClient(Collections, transport);
            }
            return collections;
        },
        get points() {
            if (!points) {
                points = createPromiseClient(Points, transport);
            }
            return points;
        },
        get snapshots() {
            if (!snapshots) {
                snapshots = createPromiseClient(Snapshots, transport);
            }
            return snapshots;
        },
        get service() {
            if (!service) {
                service = createPromiseClient(Qdrant, transport);
            }
            return service;
        },
    } satisfies Clients;
}

export function createApis(baseUrl: string, {timeout, apiKey}: {timeout: number; apiKey?: string}): GrpcClients {
    const interceptors: Interceptor[] = [];
    if (Number.isFinite(timeout)) {
        interceptors.push((next) => async (req) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                return await next(req);
            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') {
                    throw new QdrantClientTimeoutError(e.message);
                }
                throw e;
            } finally {
                clearTimeout(id);
            }
        });
    }
    if (apiKey !== undefined) {
        interceptors.push((next) => async (req) => {
            req.header.set('api-key', apiKey);
            return await next(req);
        });
    }
    const transport = createGrpcTransport({
        baseUrl,
        httpVersion: apiKey ? '2' : '1.1',
        keepSessionAlive: true,
        useBinaryFormat: true,
        sendCompression: compressionGzip,
        acceptCompression: [compressionGzip],
        interceptors,
    });

    return createClients(transport);
}

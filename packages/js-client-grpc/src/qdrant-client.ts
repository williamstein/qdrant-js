import {GrpcClients, createApis} from './api-client.js';
import {QdrantClientConfigError} from './errors.js';

export type QdrantGrpcClientParams = {
    port?: number | null;
    apiKey?: string;
    https?: boolean;
    prefix?: string;
    url?: string;
    host?: string;
    timeout?: number;
};

export class QdrantGrpcClient {
    #https: boolean;
    #scheme: string;
    #port: number | null;
    #prefix: string;
    #host: string;
    #grcpClients: GrpcClients;
    private _restUri: string;

    constructor({url, host, apiKey, https, prefix, port = 6334, timeout = 300_000}: QdrantGrpcClientParams = {}) {
        this.#https = https ?? typeof apiKey === 'string';
        this.#scheme = this.#https ? 'https' : 'http';
        this.#prefix = prefix ?? '';

        if (this.#prefix.length > 0 && !this.#prefix.startsWith('/')) {
            this.#prefix = `/${this.#prefix}`;
        }

        if (url && host) {
            throw new QdrantClientConfigError(
                `Only one of \`url\`, \`host\` params can be set. Url is ${url}, host is ${host}`,
            );
        }
        if (host && (host.startsWith('http://') || host.startsWith('https://') || /:\d+$/.test(host))) {
            throw new QdrantClientConfigError(
                'The `host` param is not expected to contain neither protocol (http:// or https://) nor port (:6333).\n' +
                    'Try to use the `url` parameter instead.',
            );
        } else if (url) {
            if (!(url.startsWith('http://') || url.startsWith('https://'))) {
                throw new QdrantClientConfigError(
                    'The `url` param expected to contain a valid URL starting with a protocol (http:// or https://).',
                );
            }
            const parsedUrl = new URL(url);
            this.#host = parsedUrl.hostname;
            this.#port = parsedUrl.port ? Number(parsedUrl.port) : port;
            this.#scheme = parsedUrl.protocol.replace(':', '');

            if (this.#prefix.length > 0 && parsedUrl.pathname !== '/') {
                throw new QdrantClientConfigError(
                    'Prefix can be set either in `url` or in `prefix`.\n' +
                        `url is ${url}, prefix is ${parsedUrl.pathname}`,
                );
            }
        } else {
            this.#port = port;
            this.#host = host ?? '127.0.0.1';
        }

        if (typeof apiKey === 'string') {
            if (this.#scheme === 'http') {
                console.warn('Api key is used with unsecure connection.');
            }
        }

        const address = this.#port ? `${this.#host}:${this.#port}` : this.#host;
        this._restUri = `${this.#scheme}://${address}${this.#prefix}`;

        this.#grcpClients = createApis(this._restUri, {apiKey, timeout});
    }

    /**
     * API getter
     *
     * @param string Name of api
     * @returns An instance of a namespaced API, generated from grpc services.
     */
    api<T extends keyof GrpcClients>(name: T): GrpcClients[T] {
        return this.#grcpClients[name];
    }
}

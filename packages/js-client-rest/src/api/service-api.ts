import {Client, withFieldsMask} from '../api-client.js';

export function createServiceApi(client: Client) {
    return {
        /**
         * Get lock options. If write is locked, all write operations and collection creation are forbidden
         */
        getLocks: withFieldsMask(client.path('/locks').method('get').create()),

        /**
         * Collect metrics data including app info, collections info, cluster info and statistics
         */
        metrics: withFieldsMask(client.path('/metrics').method('get').create()),

        /**
         * Set lock options. If write is locked, all write operations and collection creation are forbidden. Returns previous lock options
         */
        postLocks: withFieldsMask(client.path('/locks').method('post').create()),
        /**
         * Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics
         */
        telemetry: withFieldsMask(client.path('/telemetry').method('get').create()),
    } as const;
}

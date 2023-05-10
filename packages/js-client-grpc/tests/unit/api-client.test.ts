// import {createApis} from '../../src/api-client.js';
import {vi} from 'vitest';
// import {QdrantClientTimeoutError} from '../../src/errors.js';
import {describe, test} from 'vitest';

vi.mock('http2', () => {
    console.log('FACTORY');
});

const baseUrl = 'http:/127.0.0.1:6334';

describe('createApis', () => {
    // test.skip('headers: api-key', async () => {
    //     const {createApis} = await import('../../src/api-client.js');
    //     const clients = createApis(baseUrl, {timeout: Infinity});
    //     const response = await clients.service.healthCheck({});

    //     console.log(response);
    // });

    test.only('signal abort: timeout', async () => {
        const {createApis} = await import('../../src/api-client.js');
        const clients = createApis(baseUrl, {timeout: 0});

        // await clients.service.healthCheck({} /*, {timeoutMs: 0}*/);
        const response = await clients.service.healthCheck({});

        console.log(response);
    });
});

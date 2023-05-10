import {maybe} from '@sevinf/maybe';
import {QdrantClient} from '../src/index.js';

process.on('uncaughtException', (e) => {
    console.log(e);
});
process.on('unhandledRejection', (e, promise) => {
    console.log(String(e), String(promise));
});
// Listen to Ctr + C and exit
process.once('SIGINT', () => {
    process.exit(130);
});

async function main(): Promise<number> {
    const apiKey = process.env.QDRANT_API_KEY;
    const url = maybe(process.env.QDRANT_URL).orThrow();

    const client = new QdrantClient({url, apiKey});

    await client.api('collections').delete({collectionName: 'test'});

    const response = await client.api('collections').create({
        collectionName: 'test',
        vectorsConfig: {
            config: {case: 'params', value: {distance: 3, size: BigInt(4)}},
        },
    });

    console.log(response.result);

    return 0;
}

main()
    .then((code) => {
        process.exit(code);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

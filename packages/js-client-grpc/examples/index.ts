import {maybe} from '@sevinf/maybe';
import {QdrantGrpcClient as QdrantClient} from '../src/index.js';
import {VectorParams, VectorsConfig} from '../src/proto/collections_pb.js';

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
    const apiKey = maybe(process.env.QDRANT_API_KEY).orThrow();
    const url = maybe(process.env.QDRANT_URL).orThrow();

    const client = new QdrantClient({url, apiKey});
    const vectorsConfig = new VectorsConfig({
        config: {case: 'params', value: new VectorParams({distance: 3, size: BigInt(4)})},
    });
    await client.api('collections').delete({collectionName: 'test'});
    const response = await client.api('collections').create({collectionName: 'test', vectorsConfig});

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

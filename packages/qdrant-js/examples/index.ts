import {QdrantClient} from '@qdrant/qdrant-js';
import {QdrantClient as QdrantGrpcClient} from '@qdrant/qdrant-js/grpc';

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
    const url = process.env.QDRANT_URL;

    const client = new QdrantClient({url, apiKey});

    console.log(await client.api('service').telemetry({}));

    const grpcClient = new QdrantGrpcClient({url, apiKey});

    await grpcClient.api('collections').delete({collectionName: 'test'});

    const response = await grpcClient.api('collections').create({
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

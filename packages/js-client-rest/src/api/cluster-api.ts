import {Client, withFieldsMask} from '../api-client.js';

export function createClusterApi(client: Client) {
    return {
        /**
         * Get information about the current state and composition of the cluster
         */
        clusterStatus: withFieldsMask(client.path('/cluster').method('get').create()),

        /**
         * Get cluster information for a collection
         */
        collectionClusterInfo: withFieldsMask(
            client.path('/collections/{collection_name}/cluster').method('get').create(),
        ),

        recoverCurrentPeer: withFieldsMask(client.path('/cluster/recover').method('post').create()),

        /**
         * Tries to remove peer from the cluster. Will return an error if peer has shards on it.
         */
        removePeer: withFieldsMask(client.path('/cluster/peer/{peer_id}').method('delete').create({force: true})),

        updateCollectionCluster: withFieldsMask(
            client.path('/collections/{collection_name}/cluster').method('post').create({timeout: true}),
        ),
    } as const;
}

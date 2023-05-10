import {Client, withFieldsMask} from '../api-client.js';

export function createCollectionsApi(client: Client) {
    return {
        /**
         * Get cluster information for a collection
         */
        collectionClusterInfo: withFieldsMask(
            client.path('/collections/{collection_name}/cluster').method('get').create(),
        ),

        /**
         * Create new collection with given parameters
         */
        createCollection: withFieldsMask(
            client.path('/collections/{collection_name}').method('put').create({timeout: true}),
        ),

        /**
         * Create index for field in collection
         */
        createFieldIndex: withFieldsMask(
            client.path('/collections/{collection_name}/index').method('put').create({ordering: true, wait: true}),
        ),

        /**
         * Create new snapshot for a collection
         */
        createSnapshot: withFieldsMask(
            client.path('/collections/{collection_name}/snapshots').method('post').create({wait: true}),
        ),

        /**
         * Drop collection and all associated data
         */
        deleteCollection: withFieldsMask(
            client.path('/collections/{collection_name}').method('delete').create({timeout: true}),
        ),

        /**
         * Delete field index for collection
         */
        deleteFieldIndex: withFieldsMask(
            client
                .path('/collections/{collection_name}/index/{field_name}')
                .method('delete')
                .create({ordering: true, wait: true}),
        ),

        /**
         * Delete snapshot for a collection
         */
        deleteSnapshot: withFieldsMask(
            client
                .path('/collections/{collection_name}/snapshots/{snapshot_name}')
                .method('delete')
                .create({wait: true}),
        ),

        /**
         * Get detailed information about specified existing collection
         */
        getCollection: withFieldsMask(client.path('/collections/{collection_name}').method('get').create()),

        /**
         * Get list of all aliases for a collection
         */
        getCollectionAliases: withFieldsMask(
            client.path('/collections/{collection_name}/aliases').method('get').create(),
        ),

        /**
         * Get list name of all existing collections
         */
        getCollections: withFieldsMask(client.path('/collections').method('get').create()),

        /**
         * Get list of all existing collections aliases
         */
        getCollectionsAliases: withFieldsMask(client.path('/aliases').method('get').create()),

        /**
         * Download specified snapshot from a collection as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getSnapshot: withFieldsMask(
            client.path('/collections/{collection_name}/snapshots/{snapshot_name}').method('get').create(),
        ),

        /**
         * Get list of snapshots for a collection
         */
        listSnapshots: withFieldsMask(client.path('/collections/{collection_name}/snapshots').method('get').create()),

        /**
         * Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
        recoverFromSnapshot: withFieldsMask(
            client.path('/collections/{collection_name}/snapshots/recover').method('put').create({wait: true}),
        ),

        updateAliases: withFieldsMask(client.path('/collections/aliases').method('post').create({timeout: true})),

        /**
         * Update parameters of the existing collection
         */
        updateCollection: withFieldsMask(
            client.path('/collections/{collection_name}').method('patch').create({timeout: true}),
        ),

        updateCollectionCluster: withFieldsMask(
            client.path('/collections/{collection_name}/cluster').method('post').create({timeout: true}),
        ),
    } as const;
}

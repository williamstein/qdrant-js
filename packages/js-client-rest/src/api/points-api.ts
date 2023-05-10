import {Client, withFieldsMask} from '../api-client.js';

export function createPointsApi(client: Client) {
    return {
        /**
         * Remove all payload for specified points
         */
        clearPayload: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/payload/clear')
                .method('post')
                .create({ordering: true, wait: true}),
        ),

        /**
         * Count points which matches given filtering condition
         */
        countPoints: withFieldsMask(client.path('/collections/{collection_name}/points/count').method('post').create()),

        /**
         * Delete specified key payload for points
         */
        deletePayload: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/payload/delete')
                .method('post')
                .create({wait: true, ordering: true}),
        ),

        /**
         * Delete points
         */
        deletePoints: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/delete')
                .method('post')
                .create({wait: true, ordering: true}),
        ),

        /**
         * Retrieve full information of single point by id
         */
        getPoint: withFieldsMask(client.path('/collections/{collection_name}/points/{id}').method('get').create()),

        /**
         * Retrieve multiple points by specified IDs
         */
        getPoints: withFieldsMask(
            client.path('/collections/{collection_name}/points').method('post').create({consistency: true}),
        ),

        /**
         * Replace full payload of points with new one
         */
        overwritePayload: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/payload')
                .method('put')
                .create({wait: true, ordering: true}),
        ),

        /**
         * Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        recommendBatchPoints: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/recommend/batch')
                .method('post')
                .create({consistency: true}),
        ),

        /**
         * Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        recommendPoints: withFieldsMask(
            client.path('/collections/{collection_name}/points/recommend').method('post').create({consistency: true}),
        ),

        /**
         * Scroll request - paginate over all points which matches given filtering condition
         */
        scrollPoints: withFieldsMask(
            client.path('/collections/{collection_name}/points/scroll').method('post').create({consistency: true}),
        ),

        /**
         * Retrieve by batch the closest points based on vector similarity and given filtering conditions
         */
        searchBatchPoints: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/search/batch')
                .method('post')
                .create({consistency: true}),
        ),

        /**
         * Retrieve closest points based on vector similarity and given filtering conditions
         */
        searchPoints: withFieldsMask(
            client.path('/collections/{collection_name}/points/search').method('post').create({consistency: true}),
        ),

        /**
         * Set payload values for points
         */
        setPayload: withFieldsMask(
            client
                .path('/collections/{collection_name}/points/payload')
                .method('post')
                .create({wait: true, ordering: true}),
        ),

        /**
         * Perform insert + updates on points. If point with given ID already exists - it will be overwritten.
         */
        upsertPoints: withFieldsMask(
            client.path('/collections/{collection_name}/points').method('put').create({wait: true, ordering: true}),
        ),
    } as const;
}

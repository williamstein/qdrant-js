import {components, operations} from './openapi/generated-schema.js';

export interface RestArgs {
    headers: Headers;
    timeout: number;
}

export type SchemaFor<K extends keyof T, T extends object = components['schemas']> = T[K];

export type Writeable<T> = {-readonly [P in keyof T]: T[P]};

export type Unionize<T extends object> = {
    [K in keyof T]: T[K];
}[keyof T];

type CamelizeString<T extends string> = T extends `${infer F}_${infer R}` ? `${F}${Capitalize<CamelizeString<R>>}` : T;

export type Camelize<T> = {
    [K in keyof T as CamelizeString<K & string>]: T[K] extends (infer A)[]
        ? A extends Record<string, unknown>
            ? Camelize<A>[]
            : T[K]
        : T[K] extends Record<string, unknown>
        ? Camelize<T[K]>
        : T[K];
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
type OperationResponses<
    K extends keyof T,
    U extends keyof T[K] = any,
    T extends operations = operations,
> = 'responses' extends U ? T[K]['responses'] : never;

// Definitions (in OpenAPI 2.0) or Schemas (in OpenAPI 3.0) – Data models that describe your API inputs and outputs.
export type Schemas = components['schemas'];

/** @see https://stackoverflow.com/a/59071783/558180 */
export type PickRenameMulti<T, R extends {[K in keyof R]: K extends keyof T ? PropertyKey : 'Error: key not in T'}> = {
    [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

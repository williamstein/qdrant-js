import openapiTS from 'openapi-typescript';
import {ts, Project, PropertySignature, StructureKind, VariableDeclarationKind} from 'ts-morph';
import {join} from 'node:path';

const openApiSchemaOutputPath = 'src/openapi/generated-schema.ts';
const openApiSchemaRemoteUrl = 'https://raw.githubusercontent.com/qdrant/qdrant/master/docs/redoc/master/openapi.json';
const fieldRenameMap: Record<string, string> = {};

function normalizeFields(source: Record<string, unknown> | unknown): Record<string, unknown> | unknown {
    if (Array.isArray(source)) {
        return source.map((value) => normalizeFields(value));
    } else if (isObject(source)) {
        for (const key of Object.keys(source)) {
            if (isPropInObject(fieldRenameMap, key)) {
                const newKey = fieldRenameMap[key];
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete Object.assign(source, {[newKey]: normalizeFields(source[key])})[key];
            }
        }
    }
    return source;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isPropInObject<T>(obj: T, key: PropertyKey): key is keyof T {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function snakeToCamelCase(snakeCase: string): string {
    const words = snakeCase.split('_');
    let camelCase = words.shift()!;
    for (const word of words) {
        camelCase += `${word[0].toUpperCase()}${word.substring(1)}`;
    }
    return camelCase;
}

async function main() {
    const project = new Project();
    const fileName = new URL(join('../', openApiSchemaOutputPath), import.meta.url).pathname;
    const sourceText = await openapiTS(openApiSchemaRemoteUrl);
    const sourceFile = project.createSourceFile(fileName, sourceText, {overwrite: true});
    const nodesToRename: PropertySignature[] = [];

    sourceFile
        .getInterface('components')
        ?.getFirstDescendantByKind(ts.SyntaxKind.PropertySignature)
        ?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature)
        .forEach((node) => {
            node.getDescendantsOfKind(ts.SyntaxKind.PropertySignature).forEach((node) => {
                if (node.getName().includes('_')) {
                    nodesToRename.push(node);
                }
            });
        });

    sourceFile
        .getInterface('operations')
        ?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature)
        .forEach((node) => {
            node.getDescendantsOfKind(ts.SyntaxKind.PropertySignature).forEach((node) => {
                if (node.getName() === 'parameters') {
                    node.getDescendantsOfKind(ts.SyntaxKind.PropertySignature).forEach((node) => {
                        if (node.getName() === 'query' || node.getName() === 'path') {
                            node.getDescendantsOfKind(ts.SyntaxKind.PropertySignature).forEach((node) => {
                                nodesToRename.push(node);
                            });
                        }
                    });
                }
            });
        });

    for (const node of nodesToRename) {
        const snakeCasedName = node.getName();
        const camelCasedName = snakeToCamelCase(snakeCasedName);
        node.rename(camelCasedName);
        fieldRenameMap[camelCasedName] = snakeCasedName;
        fieldRenameMap[snakeCasedName] = camelCasedName;
    }
    sourceFile.addVariableStatement({
        declarations: [
            {
                name: 'fieldRenameMap',
                kind: StructureKind.VariableDeclaration,
                initializer: JSON.stringify(fieldRenameMap),
            },
        ],
        declarationKind: VariableDeclarationKind.Const,
    });
    sourceFile.addFunctions([
        {
            name: 'isObject',
            parameters: [{name: 'value', type: 'unknown'}],
            returnType: 'value is Record<string, unknown>',
            statements: isObject.toString().split('\n').slice(1, -1).join('\n'),
        },
        {
            name: 'isPropInObject',
            typeParameters: [{name: 'T'}],
            returnType: 'key is keyof T',
            parameters: [
                {name: 'obj', type: 'T'},
                {name: 'key', type: 'PropertyKey'},
            ],
            statements: isPropInObject.toString().split('\n').slice(1, -1).join('\n'),
        },
        {
            isExported: true,
            name: 'normalizeFields',
            parameters: [{name: 'source', type: 'Record<string, unknown> | unknown'}],
            returnType: 'Record<string, unknown> | unknown',
            statements: normalizeFields.toString().split('\n').slice(1, -1).join('\n'),
        },
    ]);

    await project.save();
}

void main();

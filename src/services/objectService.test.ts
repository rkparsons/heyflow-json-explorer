import { describe, expect, test } from 'vitest';

import { ObjectService } from './objectService';

describe('getPathAsArray(path)', function () {
    test.each([
        ['res', []],
        ['res.fields', ['fields']],
        ['res.fields[0].id', ['fields', '0', 'id']],
        ['res.fields[0].prop', ['fields', '0', 'prop']],
    ])('when path is "%s", then it should return %o', (path, result) => {
        const pathArray = ObjectService.getPathAsArray(path);
        expect(pathArray).toStrictEqual(result);
    });
    test('when path is empty, then it should return undefined', () => {
        const pathArray = ObjectService.getPathAsArray('');
        expect(pathArray).toStrictEqual(undefined);
    });
});

describe('getValueAtPath(obj, path)', function () {
    test.each([
        ['res.valueProp', { valueProp: false }, false],
        ['res.arrayProp[0].id', { arrayProp: [{ id: 1 }] }, 1],
        ['res.objectProp.a', { objectProp: { a: 'ok' } }, 'ok'],
        ['res.notFound', { valueProp: false }, undefined],
    ])('when path is "%s" and obj is %o, then it should return %o', (path, obj, result) => {
        const value = ObjectService.getValueAtPath(obj, path);
        expect(value).toStrictEqual(result);
    });
    test('when path is "res" and obj is {}, then it should return {}', () => {
        const value = ObjectService.getValueAtPath({}, 'res');
        expect(value).toStrictEqual({});
    });
});

describe('parseAsObjectOrString(jsonString)', function () {
    test.each([
        ['iban', 'iban'],
        ['{ "objectProp": 1 }', { objectProp: 1 }],
        ['[1, 2, 3]', [1, 2, 3]],
        ['[1, 2, { "a": 1 }]', [1, 2, { a: 1 }]],
        [null, null],
    ])('when jsonString is "%s", then it should return %o', (stringValue, result) => {
        const value = ObjectService.parseAsObjectOrString(stringValue);
        expect(value).toStrictEqual(result);
    });

    test.each([undefined, '{ a: 1 }'])('when jsonString is %s, then it should return stringified', (stringValue) => {
        const value = ObjectService.parseAsObjectOrString(stringValue);
        expect(value).toStrictEqual(stringValue);
    });
});

describe('setObjectProperty(obj, path, value))', function () {
    test.each([
        [{ id: 1 }, 'res.iban', 'abcd', { id: 1, iban: 'abcd' }],
        [{ id: 1 }, 'res.id', 2, { id: 2 }],
        [{ props: { a: 2 } }, 'res.props.a', 3, { props: { a: 3 } }],
        [{ fields: [{ id: 1 }, { id: 1 }] }, 'res.fields[1].id', 2, { fields: [{ id: 1 }, { id: 2 }] }],
    ])('when obj is %o and path is "%s" and value is %o, then obj should become %o', (obj, path, value, updatedObj) => {
        ObjectService.setObjectProperty(obj, path, value);
        expect(obj).toStrictEqual(updatedObj);
    });
});

describe('getCloneWithUpdatedProperty(obj, path, value))', function () {
    test.each([
        [{ id: 1 }, 'res.iban', 'abcd', { id: 1, iban: 'abcd' }],
        [{ id: 1 }, 'res.id', 2, { id: 2 }],
        [{ props: { a: 2 } }, 'res.props.a', 3, { props: { a: 3 } }],
        [{ fields: [{ id: 1 }, { id: 1 }] }, 'res.fields[1].id', 2, { fields: [{ id: 1 }, { id: 2 }] }],
    ])('when obj is %o and path is "%s" and value is %o, then it should return cloned object %o', (obj, path, value, updatedObj) => {
        const result = ObjectService.getCloneWithUpdatedProperty(obj, path, value);
        expect(result).toStrictEqual(updatedObj);
        expect(obj).not.toBe(result);
    });
});

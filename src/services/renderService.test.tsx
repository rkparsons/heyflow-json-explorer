import { describe, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RenderService } from './renderService';

const basePath = 'res';
const mockCallback = vi.fn();

describe('render(json, path)', function () {
    test('when json is array, then it should call renderArray', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const mockRenderArray = vi.spyOn(renderService, 'renderArray').mockImplementation(vi.fn());
        const json: Json[] = [{ a: 1 }, { b: 2 }];
        const path = 'res.fields';

        renderService.render(path, json);

        expect(mockRenderArray).toBeCalledWith(path, json);
        expect(mockRenderArray).toHaveBeenCalledOnce();
    });

    test('when json is object, then it should call renderObject', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const mockRenderObject = vi.spyOn(renderService, 'renderObject').mockImplementation(vi.fn());
        const json = { a: 1 };
        const path = 'res.child';

        renderService.render(path, json);

        expect(mockRenderObject).toBeCalledWith(path, json);
        expect(mockRenderObject).toHaveBeenCalledOnce();
    });

    test('when json is value, then it should call renderValue', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const mockRenderValue = vi.spyOn(renderService, 'renderValue').mockImplementation(vi.fn());
        const json = 'my value';
        const path = 'res.child.name';

        renderService.render(path, json);

        expect(mockRenderValue).toBeCalledWith(json);
        expect(mockRenderValue).toHaveBeenCalledOnce();
    });

    test('when json is null, then it should return "null"', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const json = null;
        const path = 'res.child.iban';

        render(<>{renderService.render(path, json)}</>);

        expect(screen.getByText('null', { exact: false })).toBeInTheDocument();
    });
});

describe('renderProperty(path, jsonObjectKey, jsonObjectValue)', function () {
    test.each([
        [`${basePath}.fields[0]`, 'id', 10],
        [`${basePath}.fields[0].child`, 'x', 100],
    ])(
        'when path is "%s" and key is "%s" and value is %o, then it should render button with key text and call render on value',
        (path, key, value) => {
            const renderService = new RenderService(basePath, {}, mockCallback);
            const mockRender = vi.spyOn(renderService, 'render').mockImplementation(vi.fn());

            render(<>{renderService.renderProperty(path, key, value)}</>);

            expect(screen.getByRole('button', { name: key })).toBeInTheDocument();
            expect(mockRender).toBeCalledWith(`${path}.${key}`, value);
            expect(mockRender).toHaveBeenCalledOnce();
        }
    );
});

describe('renderObject(path, jsonObject)', function () {
    test('should call renderBlock once and renderProperty on each object property', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const path = `${basePath}.fields.child`;
        const testObject = { x: 1, y: 2, z: 3 };
        const objectEntries = Object.entries(testObject);

        const mockRenderBlock = vi.spyOn(renderService, 'renderBlock').mockImplementation(vi.fn());
        const mockRenderProperty = vi.spyOn(renderService, 'renderProperty').mockImplementation(vi.fn());

        renderService.renderObject(path, testObject);

        expect(mockRenderBlock).toBeCalledTimes(1);
        expect(mockRenderProperty).toBeCalledTimes(objectEntries.length);
        objectEntries.forEach(([jsonObjectKey, jsonObjectValue]) => {
            expect(mockRenderProperty).toBeCalledWith(path, jsonObjectKey, jsonObjectValue);
        });
    });
});

describe('renderArray(path, jsonArray)', function () {
    test('should call render on each element of array', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);
        const path = `${basePath}.fields`;
        const testArray = [1, 2, 3];

        const mockRender = vi.spyOn(renderService, 'render').mockImplementation(vi.fn());

        renderService.renderArray(path, testArray);

        expect(mockRender).toBeCalledTimes(3);
        testArray.forEach((item, index) => expect(mockRender).toBeCalledWith(`${path}[${index}]`, item));
    });
});

describe('renderValue(value)', function () {
    test.each([
        [null, 'null'],
        [1, '1'],
        [true, 'true'],
    ])('when value is %o, then it should return %o', (value, expectedResult) => {
        const renderService = new RenderService(basePath, {}, mockCallback);

        const result = renderService.renderValue(value);

        expect(result).toStrictEqual(expectedResult);
    });
});

describe('renderBlock(path, block)', function () {
    const testBlock = 'JSX block here';

    test('when at base path, then block should render without brackets', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);

        render(<>{renderService.renderBlock(basePath, testBlock)}</>);

        expect(screen.getByText(testBlock)).toBeInTheDocument();
    });

    test('when not at base path, then block should render with brackets', () => {
        const renderService = new RenderService(basePath, {}, mockCallback);

        render(<>{renderService.renderBlock(`${basePath}.props`, testBlock)}</>);

        expect(screen.getByText(`{${testBlock}}`)).toBeInTheDocument();
    });
});

import { render, screen, waitFor } from '@testing-library/react';

import { JSONExplorer } from '.';
import userEvent from '@testing-library/user-event';

const basePath = 'res';
const testJson = {
    date: '2021-10-27T07:49:14.896Z',
    hasError: false,
    fields: [
        {
            id: '4c212130',
            prop: 'iban',
            value: 'DE81200505501265402568',
        },
    ],
};
const jsonExplorer = <JSONExplorer basePath={basePath} initialValue={testJson} />;

test('matches snapshot', () => {
    const { container } = render(jsonExplorer);

    expect(container).toMatchSnapshot();
});

test.each([
    ['date', 'res.date', testJson.date, 'string'],
    ['hasError', 'res.hasError', testJson.hasError.toString(), 'boolean'],
    ['fields', 'res.fields', JSON.stringify(testJson.fields), 'array'],
    ['id', 'res.fields[0].id', testJson.fields[0].id, 'string'],
])('when %s at path %s is clicked, then it should display the name, value and type', async (key, path, value, valueType) => {
    render(jsonExplorer);

    const pathInput = screen.getByLabelText('Property');
    const valueInput = screen.getByLabelText('Value');
    const typeInput = screen.getByLabelText('Type');
    const keyButton = screen.getByRole('button', { name: key });

    userEvent.click(keyButton);

    await waitFor(() => {
        expect(pathInput).toHaveValue(path);
        expect(valueInput).toHaveValue(value);
        expect(typeInput).toHaveValue(valueType);
    });
});

test.each([
    ['id', 'res.fields[0].id', 'myNewId', "'myNewId'"],
    ['hasError', 'res.hasError', 'true', 'true'],
])(
    'when key %s is selected at path %s and value set to %o and Update button is pressed, then it should update the value to %s',
    async (key, path, newValue, renderedValue) => {
        render(jsonExplorer);

        const pathInput = screen.getByLabelText('Property');
        const valueInput = screen.getByLabelText('Value');
        const keyButton = screen.getByRole('button', { name: key });
        const updateButton = screen.getByRole('button', { name: /update/i });

        userEvent.click(keyButton);

        await waitFor(() => {
            expect(pathInput).toHaveValue(path);
        });

        userEvent.clear(valueInput);
        await userEvent.type(valueInput, newValue);
        userEvent.click(updateButton);

        expect(await screen.findByText(`: ${renderedValue}`, { exact: false })).toBeInTheDocument();
    }
);

test.each([['prop', 'res.fields[0].prop', '{ "aaa": 1, "bbb": 2 }', { aaa: 1, bbb: 2 }]])(
    'when value is turned into an object block, then it should create keys for each parameter',
    async (key, path, newValue, result) => {
        render(jsonExplorer);

        const pathInput = screen.getByLabelText('Property');
        const valueInput = screen.getByLabelText('Value');
        const keyButton = screen.getByRole('button', { name: key });
        const updateButton = screen.getByRole('button', { name: /update/i });

        userEvent.click(keyButton);

        await waitFor(() => {
            expect(pathInput).toHaveValue(path);
        });

        userEvent.clear(valueInput);
        const inputEscaped = newValue.replace('{', '{{');
        await userEvent.type(valueInput, inputEscaped);
        userEvent.click(updateButton);

        await waitFor(() => {
            Object.keys(result).forEach((expectedKey) => {
                const keyButton = screen.getByRole('button', { name: expectedKey });
                expect(keyButton).toBeInTheDocument();
            });
        });
    }
);

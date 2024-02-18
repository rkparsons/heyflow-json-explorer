import { render, screen } from '@testing-library/react';

import { SoftPanel } from '.';

const softPanel = (
    <SoftPanel>
        <button />
    </SoftPanel>
);

test('matches snapshot', () => {
    const { container } = render(softPanel);

    expect(container).toMatchSnapshot();
});

test('renders children', () => {
    render(softPanel);

    const childElement = screen.getByRole('button');

    expect(childElement).toBeInTheDocument();
});

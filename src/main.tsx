import '@/styles/reset.scss';
import '@/styles/global.scss';

import { JSONExplorer } from './components/JSONExplorer';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <JSONExplorer
            basePath="res"
            initialValue={{
                date: '2021-10-27T07:49:14.896Z',
                hasError: false,
                fields: [
                    {
                        id: '4c212130',
                        prop: 'iban',
                        value: 'DE81200505501265402568',
                        hasError: false,
                    },
                ],
                child: {
                    a: 'test',
                    b: 'another',
                    c: 'more',
                    anotherArray: [
                        { x: true, y: false, z: null },
                        { x: false, y: true, z: true },
                    ],
                },
            }}
        />
    </React.StrictMode>
);

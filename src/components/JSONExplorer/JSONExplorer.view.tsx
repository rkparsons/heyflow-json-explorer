import { ChangeEvent, FC, useEffect, useState } from 'react';

import styles from './JSONExplorer.module.scss';

type ViewProps = {
    json: Json;
};

export const JSONExplorer: FC<ViewProps> = ({ json }) => {
    const [propertyPath, setPropertyPath] = useState<string>('res');
    const [propertyValue, setPropertyValue] = useState<Json>();

    function onPropertyChange(e: ChangeEvent<HTMLInputElement>) {
        setPropertyPath(e.target.value);
    }

    function getValueAtPath(obj: Json, path: string) {
        return getPathAsArray(path)?.reduce((prev, curr) => prev && (prev as JsonObjectChild)[curr], obj);
    }

    function getPathAsArray(path: string | undefined) {
        return path?.match(/([^[.\]])+/g)?.slice(1);
    }

    useEffect(() => {
        setPropertyValue(getValueAtPath(json, propertyPath));
    }, [propertyPath, json]);

    return (
        <>
            <fieldset className={styles.fields}>
                <label>
                    <div>Property</div>
                    <input
                        type="text"
                        className={styles.textBox}
                        value={propertyPath}
                        onChange={onPropertyChange}
                        placeholder="Property"
                        tabIndex={1}
                    />
                </label>
                <label>
                    <div>Type</div>
                    <input
                        type="text"
                        className={styles.textBox}
                        value={propertyValue === null ? 'null' : Array.isArray(propertyValue) ? 'array' : typeof propertyValue}
                        placeholder="Value"
                        disabled
                    />
                </label>
                <div>
                    {propertyValue === null
                        ? 'null'
                        : propertyValue === undefined
                          ? 'undefined'
                          : typeof propertyValue === 'string'
                            ? propertyValue
                            : JSON.stringify(propertyValue)}
                </div>
                <br />
                <br />
            </fieldset>

            {JSON.stringify(json)}
        </>
    );
};

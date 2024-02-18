import { ChangeEvent, FC, useEffect, useState } from 'react';

import { ObjectService } from '@/services/objectService';
import { RenderService } from '@/services/renderService';
import { SoftPanel } from '@/components/SoftPanel';
import styles from './JSONExplorer.module.scss';

type ViewProps = {
    basePath: string;
    json: Json;
};

export const JSONExplorer: FC<ViewProps> = ({ basePath, json }) => {
    const [propertyPath, setPropertyPath] = useState<string>(basePath);
    const [propertyValue, setPropertyValue] = useState<Json>();
    const renderService = new RenderService(basePath, styles, setPropertyPath);

    function onPropertyChange(e: ChangeEvent<HTMLInputElement>) {
        setPropertyPath(e.target.value);
    }

    useEffect(() => {
        setPropertyValue(ObjectService.getValueAtPath(json, propertyPath));
    }, [propertyPath, json]);

    return (
        <>
            <fieldset className={styles.fields}>
                <label>
                    <div>Property</div>
                    <input
                        type="text"
                        name="Property"
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
            </fieldset>

            <SoftPanel>{renderService.render(basePath, json)}</SoftPanel>
        </>
    );
};

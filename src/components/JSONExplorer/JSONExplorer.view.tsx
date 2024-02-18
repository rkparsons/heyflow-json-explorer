import { ChangeEvent, FC, useEffect, useState } from 'react';

import { ObjectService } from '@/services/objectService';
import { RenderService } from '@/services/renderService';
import { SoftPanel } from '@/components/SoftPanel';
import styles from './JSONExplorer.module.scss';

type ViewProps = {
    basePath: string;
    initialValue: Json;
};

export const JSONExplorer: FC<ViewProps> = ({ basePath, initialValue }) => {
    const [json, setJson] = useState(initialValue);
    const [propertyPath, setPropertyPath] = useState<string>(basePath);
    const [propertyValue, setPropertyValue] = useState<Json>();
    const renderService = new RenderService(basePath, styles, setPropertyPath);

    function onPropertyChange(e: ChangeEvent<HTMLInputElement>) {
        setPropertyPath(e.target.value);
    }

    function onValueChange(e: ChangeEvent<HTMLInputElement>) {
        setPropertyValue(e.target.value);
    }

    function onJsonChange() {
        if (propertyValue) {
            setJson(ObjectService.getCloneWithUpdatedProperty(json, propertyPath, propertyValue));
        }
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
                        className={styles.textBox}
                        value={propertyPath}
                        onChange={onPropertyChange}
                        placeholder="Property"
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
                <label className={styles.fullWidth}>
                    <div>Value</div>
                    <span className={styles.textBoxControls}>
                        <input
                            type="text"
                            name="Value"
                            className={styles.textBox}
                            value={
                                propertyValue === null
                                    ? 'null'
                                    : propertyValue === undefined
                                      ? 'undefined'
                                      : typeof propertyValue === 'string'
                                        ? propertyValue
                                        : JSON.stringify(propertyValue)
                            }
                            onChange={onValueChange}
                            placeholder="Value"
                            disabled={propertyValue === undefined}
                        />
                        <button onClick={onJsonChange} disabled={propertyValue === undefined}>
                            Update
                        </button>
                    </span>
                </label>
            </fieldset>

            <SoftPanel>{renderService.render(basePath, json)}</SoftPanel>
        </>
    );
};

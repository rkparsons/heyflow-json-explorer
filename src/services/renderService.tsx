import { ReactNode } from 'react';

export class RenderService {
    private basePath: string;
    private styles: CSSModuleClasses;
    private onKeyClick: (_: string) => void;

    constructor(basePath: string, styles: CSSModuleClasses, onKeyClick: (_: string) => void) {
        this.basePath = basePath;
        this.styles = styles;
        this.onKeyClick = onKeyClick;
    }

    render(path: string, json: Json) {
        return (
            <>
                {json === null
                    ? 'null'
                    : Array.isArray(json)
                      ? this.renderArray(path, json)
                      : typeof json === 'object'
                        ? this.renderObject(path, json)
                        : this.renderValue(json)}
                {path === this.basePath ? '' : ','}
            </>
        );
    }

    renderProperty(path: string, jsonObjectKey: string, jsonObjectValue: Json) {
        return (
            <div key={jsonObjectKey} className={path === this.basePath ? '' : this.styles.indent}>
                <button className={this.styles.keyButton} onClick={() => this.onKeyClick(path.concat(`.${jsonObjectKey}`))}>
                    {jsonObjectKey}
                </button>
                : {this.render(path.concat(`.${jsonObjectKey}`), jsonObjectValue)}
            </div>
        );
    }

    renderObject(path: string, jsonObject: JsonObjectChild) {
        return this.renderBlock(
            path,
            Object.entries(jsonObject).map(([jsonObjectKey, jsonObjectValue]) => this.renderProperty(path, jsonObjectKey, jsonObjectValue))
        );
    }

    renderArray(path: string, jsonArray: Json[]) {
        return (
            <>
                [
                {jsonArray.map((jsonArrayItem, jsonArrayIndex) => (
                    <div key={jsonArrayIndex} className={this.styles.indent}>
                        {this.render(path.concat(`[${jsonArrayIndex}]`), jsonArrayItem)}
                    </div>
                ))}
                ]
            </>
        );
    }

    renderValue(value: string | number | boolean | null) {
        return value === null ? 'null' : typeof value === 'string' ? `'${value}'` : value.toString();
    }

    renderBlock(path: string, block: ReactNode) {
        return (
            <>
                {path === this.basePath ? (
                    block
                ) : (
                    <>
                        {'{'}
                        {block}
                        {'}'}
                    </>
                )}
            </>
        );
    }
}

export abstract class ObjectService {
    static getPathAsArray(path: string | undefined) {
        return path?.match(/([^[.\]])+/g)?.slice(1);
    }

    static getValueAtPath(obj: Json, path: string) {
        return this.getPathAsArray(path)?.reduce((prev, curr) => prev && (prev as JsonObjectChild)[curr], obj);
    }

    static parseAsObjectOrString(value: Json | undefined) {
        try {
            return JSON.parse(`${value}`);
        } catch {
            return value;
        }
    }

    static setObjectProperty(obj: Json, path: string, value: Json) {
        const pathArray = this.getPathAsArray(path);

        pathArray?.reduce((prev, propertyKey, i) => {
            if (i === pathArray.length - 1) (prev as JsonObjectChild)[propertyKey] = value;
            return (prev as JsonObjectChild)[propertyKey];
        }, obj);
    }

    static getCloneWithUpdatedProperty(obj: Json, path: string, value: Json) {
        const newJsonValue = Object.assign({}, obj);

        this.setObjectProperty(newJsonValue, path, this.parseAsObjectOrString(value));

        return newJsonValue;
    }
}

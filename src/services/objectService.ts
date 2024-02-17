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
}

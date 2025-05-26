interface TextUtil {
    is: (t: any) => t is string;
    ify: (t: any) => string;
    random: (l?: number, c?: string) => string;
    match: (t: string, o: Record<string, string> | string) => boolean;
    hash: (s: string, c?: number) => number | undefined;
}
type MapReturn<MapResult> = MapResult | Array<MapResult> | string | number | Array<string | number> | Record<string, any> | undefined;
interface ListUtil<T = any> {
    is: (l: any) => l is Array<T>;
    slit: <U>(this: Array<U>, ...args: any[]) => Array<U>;
    sort: <U extends Record<string, any>>(k: keyof U) => (A: U, B: U) => number;
    map: <U, V>(l: Array<U> | Record<string, U>, c: ((val: U, key: string | number, t: CollectorFunction) => V) | U, _: any) => MapReturn<V>;
    index: number;
}
interface ObjUtil {
    is: (o: any) => o is Record<string, any>;
    put: <O extends Record<string, any>, K extends string, V>(o: O | null | undefined, k: K, v: V) => O & Record<K, V>;
    has: <T extends Record<string, any>, K extends string | number | symbol>(o: T | null | undefined, k: K) => o is T & Record<K, any>;
    del: <T extends Record<string, any>, K extends keyof T>(o: T | null | undefined, k: K) => T | undefined;
    as: <O extends Record<string, any>, K extends string, V>(o: O, k: K, v: V, u?: any) => V | Record<string, never>;
    ify: (o: any) => Record<string, any>;
    to: <F extends Record<string, any>, T extends Record<string, any>>(from: F, to?: T) => T & F;
    copy: <T extends Record<string, any>>(o: T | null | undefined) => T | null | undefined;
    empty: <T extends Record<string, any>>(o: T | null | undefined, n?: string | Record<string, any>) => boolean;
    map: <Target, MapResult>(list: Array<Target> | Record<string, Target>, callback: ((val: Target, key: string | number, t: CollectorFunction) => MapResult) | Target, context: any) => MapReturn<MapResult>;
}
interface TypeUtil {
    fn: {
        is: (fn: any) => fn is (...args: any[]) => any;
    };
    bi: {
        is: (b: any) => b is boolean;
    };
    num: {
        is: (n: any) => n is number;
    };
    text: TextUtil;
    list: ListUtil;
    obj: ObjUtil;
    time: {
        is: (t?: any) => t is Date;
    };
}
export type CollectorFunction = {
    (k: string | number, v: any): void;
    (k: string | number): void;
    r?: Record<string, any> | Array<string | number>;
};
declare const Type: TypeUtil;
export default Type;

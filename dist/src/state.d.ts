type GunNode = Record<string, any> & {
    _?: {
        '>'?: Record<string, number>;
        '#'?: string;
    };
};
interface StateInterface {
    (): number;
    drift: number;
    _: string;
    is: (n: GunNode | null | undefined, k: string, o?: any) => number;
    lex: () => string;
    ify: (n: GunNode | string | null | undefined, k?: string, s?: number, v?: any, soul?: string) => GunNode | undefined;
    to: (from: GunNode | null | undefined, k: string, to?: GunNode | string) => GunNode | undefined;
    map: {
        (cb: ((v: any, k: string, o: GunNode, opt: any) => void) | GunNode, s?: number | GunNode, as?: any): GunNode | ((v: any, k: string, o: GunNode, opt: any) => any);
        (o: GunNode, s?: number): GunNode;
    };
}
declare const State: StateInterface;
export default State;

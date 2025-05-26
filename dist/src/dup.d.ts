interface DupOptions {
    max?: number;
    age?: number;
}
interface DupItem {
    was: number;
}
interface DupState {
    [id: string]: DupItem | undefined;
}
interface DupInstance {
    s: DupState;
    check: (id: string) => DupItem | false;
    track: (id: string) => DupItem;
    drop: (age?: number) => void;
    to?: NodeJS.Timeout | null;
}
declare function Dup(opt?: DupOptions): DupInstance;
export default Dup;

export = Mesh;
export = Mesh;
declare function Mesh(root: any): {
    (): void;
    hear: {
        (raw: any, peer: any): any;
        '!'(msg: any, peer: any): void;
        '?'(msg: any, peer: any): void;
    };
    hi(peer: any): void;
    bye(peer: any): void;
};

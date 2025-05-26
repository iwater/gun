export = User;
export = User;
declare class User {
    private constructor();
    create(...args: any[]): any;
    auth(...args: any[]): any;
    pair(): any;
    leave(opt: any, cb: any): any;
    delete(alias: any, pass: any, cb: any): Promise<any>;
    recall(opt: any, cb: any): any;
    alive(): Promise<any>;
    trust(user: any): Promise<void>;
    grant(to: any, cb: any): any;
    secret(data: any, cb: any): any;
}

interface GunSoulRelation {
    '#': string;
}
interface ValLinkInterface {
    _: '#';
    is: (v: any) => string | false;
    ify: (t: string) => GunSoulRelation;
}
interface ValInterface {
    is: (v: any) => boolean;
    link: ValLinkInterface;
    rel: ValLinkInterface;
}
declare const Val: ValInterface;
export default Val;

declare module "to-regex"{
    export interface Setting{
        negate?: boolean;
        contains?: boolean;
        nocase?:boolean;
        flags?: string;
        cache?: boolean;
        safe?: boolean;
    }
    export default function toRegex(strings: string[],setting?: Setting): RegExp;
}
export declare class NodeTimestamps {
    private _created;
    private _deleted;
    private _trashed;
    private _updated;
    private _edited;
    dirty: boolean;
    constructor(createTimeSec?: number);
    load(raw: Record<string, unknown>): void;
    get created(): Date;
    get deleted(): Date | null;
    get trashed(): Date | null;
    get updated(): Date;
    get edited(): Date | null;
}
export declare function strToDt(value: string | null | undefined): Date;
export declare function intToDt(timestampSec: number): Date;
export declare function dtToStr(dt: Date): string;
export declare function intToStr(timestampSec: number): string;
export declare function epochZero(): Date;
//# sourceMappingURL=timestamps.d.ts.map

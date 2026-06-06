import { APIAuth } from "./auth.js";
import { type FetchFn } from "./keepApi.js";
import { Label, List, Note, type TopLevelNode } from "./node/index.js";
export interface FindOptions {
    query?: string | RegExp;
    func?: (node: TopLevelNode) => boolean;
    labels?: string[];
    colors?: string[];
    pinned?: boolean;
    archived?: boolean;
    trashed?: boolean;
}
export declare class Keep {
    private keepApi;
    private keepVersion;
    private labels;
    private nodes;
    private sidMap;
    constructor(fetchFn?: FetchFn);
    private clear;
    authenticate(
        email: string,
        masterToken: string,
        options?: {
            sync?: boolean;
            deviceId?: string;
        }
    ): Promise<void>;
    load(auth: APIAuth, sync?: boolean): Promise<void>;
    getMasterToken(): string;
    get(nodeId: string): TopLevelNode | undefined;
    all(): TopLevelNode[];
    find(options?: FindOptions): TopLevelNode[];
    labelsList(): Label[];
    getLabel(labelId: string): Label | undefined;
    sync(resync?: boolean): Promise<void>;
    createNote(_title?: string, _text?: string): Note;
    createList(_title?: string, _items?: Array<[string, boolean]>): List;
    createLabel(_name: string): Label;
    private syncNotes;
    private parseNodes;
    private parseUserInfo;
}
//# sourceMappingURL=keep.d.ts.map

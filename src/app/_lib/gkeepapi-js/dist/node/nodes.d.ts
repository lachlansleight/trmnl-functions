import { ColorValue, NodeType } from "./enums.js";
import {
    Element,
    NodeAnnotations,
    NodeCollaborators,
    NodeLabels,
    NodeSettings,
} from "./support.js";
import { NodeTimestamps } from "./timestamps.js";
export declare class Node extends Element {
    parent: Node | null;
    id: string;
    serverId: string | null;
    parentId: string | null;
    type: NodeType | null;
    sort: number;
    version: number | null;
    protected _text: string;
    protected children: Map<string, Node>;
    timestamps: NodeTimestamps;
    settings: NodeSettings;
    annotations: NodeAnnotations;
    moved: boolean;
    constructor(id?: string, type?: NodeType, parentId?: string | null);
    static generateId(timestampSec: number): string;
    protected loadImpl(raw: Record<string, unknown>): void;
    get text(): string;
    get childList(): Node[];
    get(nodeId: string): Node | undefined;
    append(node: Node, dirty?: boolean): Node;
    remove(node: Node, dirty?: boolean): void;
    get trashed(): boolean;
    get deleted(): boolean;
    get new(): boolean;
}
export declare class Root extends Node {
    static readonly ID = "root";
    constructor();
}
export declare class TopLevelNode extends Node {
    color: ColorValue;
    archived: boolean;
    pinned: boolean;
    title: string;
    labels: NodeLabels;
    collaborators: NodeCollaborators;
    protected nodeType: NodeType;
    constructor(nodeType: NodeType);
    protected loadImpl(raw: Record<string, unknown>): void;
    get url(): string;
}
export declare class ListItem extends Node {
    parentItem: ListItem | null;
    parentServerId: string | null;
    superListItemId: string | null;
    prevSuperListItemId: string | null;
    private subitems;
    private _checked;
    constructor(parentId?: string | null, parentServerId?: string | null);
    protected loadImpl(raw: Record<string, unknown>): void;
    indent(node: ListItem, dirty?: boolean): void;
    dedent(node: ListItem, dirty?: boolean): void;
    get subitemList(): ListItem[];
    get indented(): boolean;
    get checked(): boolean;
}
export declare class Note extends TopLevelNode {
    constructor();
    private getTextNode;
    get text(): string;
}
export declare class List extends TopLevelNode {
    static readonly SORT_DELTA = 10000;
    constructor();
    static sortedItems(items: ListItem[]): ListItem[];
    private listItems;
    get items(): ListItem[];
    get checked(): ListItem[];
    get unchecked(): ListItem[];
    get text(): string;
}
export declare class Blob extends Node {
    blob: Record<string, unknown> | null;
    constructor(parentId?: string | null);
    protected loadImpl(raw: Record<string, unknown>): void;
}
//# sourceMappingURL=nodes.d.ts.map

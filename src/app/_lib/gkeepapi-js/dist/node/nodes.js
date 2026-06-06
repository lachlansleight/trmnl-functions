import { MergeException } from "../exceptions.js";
import { ColorValue, NodeType } from "./enums.js";
import {
    Element,
    NodeAnnotations,
    NodeCollaborators,
    NodeLabels,
    NodeSettings,
} from "./support.js";
import { epochZero, NodeTimestamps } from "./timestamps.js";
export class Node extends Element {
    parent = null;
    id;
    serverId = null;
    parentId;
    type;
    sort;
    version = null;
    _text = "";
    children = new Map();
    timestamps;
    settings;
    annotations;
    moved = false;
    constructor(id, type, parentId) {
        super();
        const createTime = Date.now() / 1000;
        this.id = id ?? Node.generateId(createTime);
        this.parentId = parentId ?? null;
        this.type = type ?? null;
        this.sort = Math.floor(Math.random() * 9000000000) + 1000000000;
        this.timestamps = new NodeTimestamps(createTime);
        this.settings = new NodeSettings();
        this.annotations = new NodeAnnotations();
    }
    static generateId(timestampSec) {
        const ms = Math.floor(timestampSec * 1000);
        const rand = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            .toString(16)
            .padStart(16, "0");
        return `${ms.toString(16)}.${rand}`;
    }
    loadImpl(raw) {
        super.loadImpl(raw);
        if (!Object.values(NodeType).includes(raw.type)) {
            throw new Error(`Unknown node type: ${String(raw.type)}`);
        }
        if (raw.kind !== "notes#node") {
            // unknown kind — continue
        }
        if ("mergeConflict" in raw) {
            throw new MergeException(raw);
        }
        this.id = String(raw.id);
        this.serverId = typeof raw.serverId === "string" ? raw.serverId : this.serverId;
        this.parentId = String(raw.parentId);
        if (typeof raw.sortValue === "number") {
            this.sort = raw.sortValue;
        }
        if (typeof raw.baseVersion === "number") {
            this.version = raw.baseVersion;
        }
        if (typeof raw.text === "string") {
            this._text = raw.text;
        }
        this.timestamps.load(raw.timestamps);
        this.settings.load(raw.nodeSettings);
        this.annotations.load(raw.annotationsGroup);
    }
    get text() {
        return this._text;
    }
    get childList() {
        return [...this.children.values()];
    }
    get(nodeId) {
        return this.children.get(nodeId);
    }
    append(node, dirty = true) {
        this.children.set(node.id, node);
        node.parent = this;
        if (dirty) {
            this.dirty = true;
        }
        return node;
    }
    remove(node, dirty = true) {
        if (this.children.has(node.id)) {
            const child = this.children.get(node.id);
            child.parent = null;
            this.children.delete(node.id);
        }
        if (dirty) {
            this.dirty = true;
        }
    }
    get trashed() {
        return (
            this.timestamps.trashed !== null &&
            this.timestamps.trashed.getTime() > epochZero().getTime()
        );
    }
    get deleted() {
        return (
            this.timestamps.deleted !== null &&
            this.timestamps.deleted.getTime() > epochZero().getTime()
        );
    }
    get new() {
        return this.serverId === null;
    }
}
export class Root extends Node {
    static ID = "root";
    constructor() {
        super(Root.ID);
        this.dirty = false;
    }
}
export class TopLevelNode extends Node {
    color = ColorValue.White;
    archived = false;
    pinned = false;
    title = "";
    labels = new NodeLabels();
    collaborators = new NodeCollaborators();
    nodeType;
    constructor(nodeType) {
        super(undefined, nodeType, Root.ID);
        this.nodeType = nodeType;
    }
    loadImpl(raw) {
        super.loadImpl(raw);
        this.color = typeof raw.color === "string" ? raw.color : ColorValue.White;
        this.archived = Boolean(raw.isArchived);
        this.pinned = Boolean(raw.isPinned);
        this.title = typeof raw.title === "string" ? raw.title : "";
        this.labels.loadFromRaw(raw.labelIds ?? []);
        this.collaborators.loadCollaborators(raw.roleInfo ?? [], raw.shareRequests ?? []);
        this.moved = "moved" in raw;
    }
    get url() {
        return `https://keep.google.com/u/0/#${this.nodeType}/${this.id}`;
    }
}
export class ListItem extends Node {
    parentItem = null;
    parentServerId = null;
    superListItemId = null;
    prevSuperListItemId = null;
    subitems = new Map();
    _checked = false;
    constructor(parentId, parentServerId) {
        super(undefined, NodeType.ListItem, parentId);
        this.parentServerId = parentServerId ?? null;
    }
    loadImpl(raw) {
        super.loadImpl(raw);
        this.prevSuperListItemId = this.superListItemId;
        this.superListItemId =
            typeof raw.superListItemId === "string" && raw.superListItemId
                ? raw.superListItemId
                : null;
        this._checked = Boolean(raw.checked);
        if (typeof raw.parentServerId === "string") {
            this.parentServerId = raw.parentServerId;
        }
    }
    indent(node, dirty = true) {
        if (node.subitemList.length > 0) {
            return;
        }
        this.subitems.set(node.id, node);
        node.superListItemId = this.id;
        node.parentItem = this;
        if (dirty) {
            node.dirty = true;
        }
    }
    dedent(node, dirty = true) {
        if (!this.subitems.has(node.id)) {
            return;
        }
        this.subitems.delete(node.id);
        node.superListItemId = "";
        node.parentItem = null;
        if (dirty) {
            node.dirty = true;
        }
    }
    get subitemList() {
        return [...this.subitems.values()];
    }
    get indented() {
        return this.parentItem !== null;
    }
    get checked() {
        return this._checked;
    }
}
export class Note extends TopLevelNode {
    constructor() {
        super(NodeType.Note);
    }
    getTextNode() {
        return this.childList.find(child => child instanceof ListItem);
    }
    get text() {
        const node = this.getTextNode();
        if (!node) {
            return this._text;
        }
        return node.text;
    }
}
export class List extends TopLevelNode {
    static SORT_DELTA = 10000;
    constructor() {
        super(NodeType.List);
    }
    static sortedItems(items) {
        const keyFunc = item => {
            if (item.indented && item.parentItem) {
                return [item.parentItem.sort, item.sort];
            }
            return [item.sort, null];
        };
        const compare = (a, b) => {
            for (let i = 0; i < Math.max(a.length, b.length); i++) {
                const av = a[i] ?? null;
                const bv = b[i] ?? null;
                if (av === bv) {
                    continue;
                }
                if (av === null) {
                    return 1;
                }
                if (bv === null) {
                    return -1;
                }
                return bv - av;
            }
            return 0;
        };
        return [...items].sort((a, b) => compare(keyFunc(a), keyFunc(b)));
    }
    listItems(checked) {
        return this.childList.filter(
            node =>
                node instanceof ListItem &&
                !node.deleted &&
                (checked === undefined || node.checked === checked)
        );
    }
    get items() {
        return List.sortedItems(this.listItems());
    }
    get checked() {
        return List.sortedItems(this.listItems(true));
    }
    get unchecked() {
        return List.sortedItems(this.listItems(false));
    }
    get text() {
        return this.items
            .map(item => `${item.indented ? "  " : ""}${item.checked ? "☑" : "☐"} ${item.text}`)
            .join("\n");
    }
}
export class Blob extends Node {
    blob = null;
    constructor(parentId) {
        super(undefined, NodeType.Blob, parentId);
    }
    loadImpl(raw) {
        super.loadImpl(raw);
        const blob = raw.blob;
        this.blob = blob && typeof blob === "object" ? blob : null;
    }
}
//# sourceMappingURL=nodes.js.map

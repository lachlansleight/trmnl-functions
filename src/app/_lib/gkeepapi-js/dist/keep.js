import { APIAuth, defaultDeviceId, KEEP_OAUTH_SCOPES } from "./auth.js";
import { NotImplementedWriteException } from "./exceptions.js";
import { ResyncRequiredException, UpgradeRecommendedException } from "./exceptions.js";
import { KeepAPI } from "./keepApi.js";
import { fromJson, Label, List, ListItem, Note, Root } from "./node/index.js";
export class Keep {
    keepApi;
    keepVersion = null;
    labels = new Map();
    nodes = new Map();
    sidMap = new Map();
    constructor(fetchFn) {
        this.keepApi = new KeepAPI(null, fetchFn);
        this.clear();
    }
    clear() {
        this.keepVersion = null;
        this.labels.clear();
        this.nodes.clear();
        this.sidMap.clear();
        const root = new Root();
        this.nodes.set(Root.ID, root);
    }
    async authenticate(email, masterToken, options = {}) {
        const { sync = true, deviceId = defaultDeviceId() } = options;
        const auth = new APIAuth(KEEP_OAUTH_SCOPES);
        await auth.load(email, masterToken, deviceId);
        await this.load(auth, sync);
    }
    async load(auth, sync = true) {
        this.keepApi.setAuth(auth);
        if (sync) {
            await this.sync();
        }
    }
    getMasterToken() {
        return this.keepApi.getAuth().getMasterToken();
    }
    get(nodeId) {
        const root = this.nodes.get(Root.ID);
        const direct = root.get(nodeId);
        if (direct instanceof Note || direct instanceof List) {
            return direct;
        }
        const mappedId = this.sidMap.get(nodeId);
        if (mappedId) {
            const mapped = root.get(mappedId);
            if (mapped instanceof Note || mapped instanceof List) {
                return mapped;
            }
        }
        return undefined;
    }
    all() {
        return this.nodes
            .get(Root.ID)
            .childList.filter(node => node instanceof Note || node instanceof List);
    }
    find(options = {}) {
        const { query, func, labels, colors, pinned, archived, trashed = false } = options;
        return this.all().filter(node => {
            if (query !== undefined) {
                if (typeof query === "string") {
                    if (!node.title.includes(query) && !node.text.includes(query)) {
                        return false;
                    }
                } else if (!query.test(node.title) && !query.test(node.text)) {
                    return false;
                }
            }
            if (func !== undefined && !func(node)) {
                return false;
            }
            if (labels !== undefined) {
                if (labels.length === 0 && node.labels.all().length > 0) {
                    return false;
                }
                if (
                    labels.length > 0 &&
                    !labels.some(labelId => node.labels.get(labelId) != null)
                ) {
                    return false;
                }
            }
            if (colors !== undefined && !colors.includes(node.color)) {
                return false;
            }
            if (pinned !== undefined && node.pinned !== pinned) {
                return false;
            }
            if (archived !== undefined && node.archived !== archived) {
                return false;
            }
            if (trashed !== undefined && node.trashed !== trashed) {
                return false;
            }
            return true;
        });
    }
    labelsList() {
        return [...this.labels.values()];
    }
    getLabel(labelId) {
        return this.labels.get(labelId);
    }
    async sync(resync = false) {
        if (resync) {
            this.clear();
        }
        await this.syncNotes();
    }
    createNote(_title, _text) {
        throw new NotImplementedWriteException("createNote");
    }
    createList(_title, _items) {
        throw new NotImplementedWriteException("createList");
    }
    createLabel(_name) {
        throw new NotImplementedWriteException("createLabel");
    }
    async syncNotes() {
        while (true) {
            const changes = await this.keepApi.changes(this.keepVersion, [], null);
            if (changes.forceFullResync) {
                throw new ResyncRequiredException("Full resync required");
            }
            if (changes.upgradeRecommended) {
                throw new UpgradeRecommendedException("Upgrade recommended");
            }
            if (changes.userInfo && typeof changes.userInfo === "object") {
                this.parseUserInfo(changes.userInfo);
            }
            if (Array.isArray(changes.nodes)) {
                this.parseNodes(changes.nodes);
            }
            this.keepVersion = String(changes.toVersion);
            if (!changes.truncated) {
                break;
            }
        }
    }
    parseNodes(raw) {
        const createdNodes = [];
        const deletedNodes = [];
        const listItemNodes = [];
        for (const rawNode of raw) {
            const nodeId = String(rawNode.id);
            let node;
            if (this.nodes.has(nodeId)) {
                node = this.nodes.get(nodeId);
                if ("parentId" in rawNode) {
                    node.load(rawNode);
                    if (node.serverId) {
                        this.sidMap.set(node.serverId, node.id);
                    }
                } else {
                    deletedNodes.push(node);
                }
            } else {
                const created = fromJson(rawNode);
                if (!created) {
                    continue;
                }
                node = created;
                this.nodes.set(nodeId, node);
                if (node.serverId) {
                    this.sidMap.set(node.serverId, node.id);
                }
                createdNodes.push(node);
            }
            if (node instanceof ListItem) {
                listItemNodes.push(node);
            }
        }
        for (const node of listItemNodes) {
            const prev = node.prevSuperListItemId;
            const curr = node.superListItemId;
            if (prev === curr) {
                continue;
            }
            if (prev && this.nodes.has(prev)) {
                this.nodes.get(prev).dedent(node, false);
            }
            if (curr && this.nodes.has(curr)) {
                this.nodes.get(curr).indent(node, false);
            }
        }
        for (const node of createdNodes) {
            const parent = this.nodes.get(node.parentId ?? "");
            parent?.append(node, false);
        }
        for (const node of deletedNodes) {
            node.parent?.remove(node);
            this.nodes.delete(node.id);
            if (node.serverId) {
                this.sidMap.delete(node.serverId);
            }
        }
        for (const node of this.all()) {
            for (const [labelId] of node.labels.labelIds) {
                node.labels.labelIds.set(labelId, this.labels.get(labelId) ?? null);
            }
        }
    }
    parseUserInfo(raw) {
        const labels = new Map();
        if (Array.isArray(raw.labels)) {
            for (const labelRaw of raw.labels) {
                const mainId = String(labelRaw.mainId);
                let label;
                if (this.labels.has(mainId)) {
                    label = this.labels.get(mainId);
                } else {
                    label = new Label();
                }
                label.load(labelRaw);
                labels.set(mainId, label);
            }
        }
        this.labels = labels;
    }
}
//# sourceMappingURL=keep.js.map

import {
    CheckedListItemsPolicyValue,
    GraveyardStateValue,
    NewListItemPlacementValue,
    RoleValue,
    ShareRequestValue,
} from "./enums.js";
import { NodeTimestamps } from "./timestamps.js";
export class Element {
    dirty = false;
    load(raw) {
        this.loadImpl(raw);
    }
    loadImpl(raw) {
        if (typeof raw._dirty === "boolean") {
            this.dirty = raw._dirty;
        }
    }
}
export class NodeSettings extends Element {
    newListItemPlacement = NewListItemPlacementValue.Bottom;
    graveyardState = GraveyardStateValue.Collapsed;
    checkedListItemsPolicy = CheckedListItemsPolicyValue.Graveyard;
    loadImpl(raw) {
        super.loadImpl(raw);
        this.newListItemPlacement = raw.newListItemPlacement;
        this.graveyardState = raw.graveyardState;
        this.checkedListItemsPolicy = raw.checkedListItemsPolicy;
    }
}
export class NodeAnnotations extends Element {
    annotations = [];
    loadImpl(raw) {
        super.loadImpl(raw);
        this.annotations = Array.isArray(raw.annotations) ? raw.annotations : [];
    }
    all() {
        return this.annotations;
    }
}
export class NodeCollaborators extends Element {
    collaborators = [];
    loadCollaborators(collaboratorsRaw, requestsRaw) {
        this.collaborators = [];
        for (const collaborator of collaboratorsRaw) {
            const email = collaborator.email;
            if (typeof email === "string") {
                this.collaborators.push(email);
            }
        }
        for (const request of requestsRaw) {
            const email = request.email;
            const type = request.type;
            if (
                typeof email === "string" &&
                (type === ShareRequestValue.Add ||
                    type === RoleValue.Owner ||
                    type === RoleValue.User)
            ) {
                if (!this.collaborators.includes(email)) {
                    this.collaborators.push(email);
                }
            }
        }
    }
    all() {
        return [...this.collaborators];
    }
}
export class Label extends Element {
    id = "";
    name = "";
    timestamps = new NodeTimestamps();
    loadImpl(raw) {
        super.loadImpl(raw);
        this.id = String(raw.mainId ?? "");
        this.name = String(raw.name ?? "");
        if (raw.timestamps && typeof raw.timestamps === "object") {
            this.timestamps.load(raw.timestamps);
        }
    }
}
export class NodeLabels extends Element {
    labelIds = new Map();
    loadFromRaw(raw) {
        if (!Array.isArray(raw)) {
            return;
        }
        const items = [...raw];
        if (items.length > 0 && typeof items[items.length - 1] === "boolean") {
            this.dirty = items.pop();
        }
        this.labelIds.clear();
        for (const entry of items) {
            if (entry && typeof entry === "object" && "labelId" in entry) {
                this.labelIds.set(String(entry.labelId), null);
            }
        }
    }
    all() {
        return [...this.labelIds.values()].filter(label => label !== null);
    }
    get(labelId) {
        return this.labelIds.get(labelId);
    }
}
//# sourceMappingURL=support.js.map

import {
    CheckedListItemsPolicyValue,
    GraveyardStateValue,
    NewListItemPlacementValue,
} from "./enums.js";
import { NodeTimestamps } from "./timestamps.js";
export declare abstract class Element {
    dirty: boolean;
    load(raw: Record<string, unknown>): void;
    protected loadImpl(raw: Record<string, unknown>): void;
}
export declare class NodeSettings extends Element {
    newListItemPlacement: NewListItemPlacementValue;
    graveyardState: GraveyardStateValue;
    checkedListItemsPolicy: CheckedListItemsPolicyValue;
    protected loadImpl(raw: Record<string, unknown>): void;
}
export declare class NodeAnnotations extends Element {
    private annotations;
    protected loadImpl(raw: Record<string, unknown>): void;
    all(): unknown[];
}
export declare class NodeCollaborators extends Element {
    private collaborators;
    loadCollaborators(
        collaboratorsRaw: Record<string, unknown>[],
        requestsRaw: Record<string, unknown>[]
    ): void;
    all(): string[];
}
export declare class Label extends Element {
    id: string;
    name: string;
    timestamps: NodeTimestamps;
    protected loadImpl(raw: Record<string, unknown>): void;
}
export declare class NodeLabels extends Element {
    readonly labelIds: Map<string, Label | null>;
    loadFromRaw(raw: unknown): void;
    all(): Label[];
    get(labelId: string): Label | null | undefined;
}
//# sourceMappingURL=support.d.ts.map

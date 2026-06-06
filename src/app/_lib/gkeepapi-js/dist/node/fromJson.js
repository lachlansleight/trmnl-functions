import { NodeType } from "./enums.js";
import { Blob, List, ListItem, Note } from "./nodes.js";
const typeMap = {
    [NodeType.Note]: Note,
    [NodeType.List]: List,
    [NodeType.ListItem]: ListItem,
    [NodeType.Blob]: Blob,
};
export function fromJson(raw) {
    const type = raw.type;
    if (typeof type !== "string") {
        return null;
    }
    try {
        const nodeType = type;
        const Cls = typeMap[nodeType];
        if (!Cls) {
            return null;
        }
        const node = new Cls();
        node.load(raw);
        return node;
    } catch {
        return null;
    }
}
export { Root } from "./nodes.js";
//# sourceMappingURL=fromJson.js.map

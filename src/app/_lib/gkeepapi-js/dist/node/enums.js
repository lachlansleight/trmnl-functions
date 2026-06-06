export var NodeType;
(function (NodeType) {
    NodeType["Note"] = "NOTE";
    NodeType["List"] = "LIST";
    NodeType["ListItem"] = "LIST_ITEM";
    NodeType["Blob"] = "BLOB";
})(NodeType || (NodeType = {}));
export var BlobType;
(function (BlobType) {
    BlobType["Audio"] = "AUDIO";
    BlobType["Image"] = "IMAGE";
    BlobType["Drawing"] = "DRAWING";
})(BlobType || (BlobType = {}));
export var ColorValue;
(function (ColorValue) {
    ColorValue["White"] = "DEFAULT";
    ColorValue["Red"] = "RED";
    ColorValue["Orange"] = "ORANGE";
    ColorValue["Yellow"] = "YELLOW";
    ColorValue["Green"] = "GREEN";
    ColorValue["Teal"] = "TEAL";
    ColorValue["Blue"] = "BLUE";
    ColorValue["DarkBlue"] = "CERULEAN";
    ColorValue["Purple"] = "PURPLE";
    ColorValue["Pink"] = "PINK";
    ColorValue["Brown"] = "BROWN";
    ColorValue["Gray"] = "GRAY";
})(ColorValue || (ColorValue = {}));
export var CategoryValue;
(function (CategoryValue) {
    CategoryValue["Books"] = "BOOKS";
    CategoryValue["Food"] = "FOOD";
    CategoryValue["Movies"] = "MOVIES";
    CategoryValue["Music"] = "MUSIC";
    CategoryValue["Places"] = "PLACES";
    CategoryValue["Quotes"] = "QUOTES";
    CategoryValue["Travel"] = "TRAVEL";
    CategoryValue["TV"] = "TV";
})(CategoryValue || (CategoryValue = {}));
export var NewListItemPlacementValue;
(function (NewListItemPlacementValue) {
    NewListItemPlacementValue["Top"] = "TOP";
    NewListItemPlacementValue["Bottom"] = "BOTTOM";
})(NewListItemPlacementValue || (NewListItemPlacementValue = {}));
export var GraveyardStateValue;
(function (GraveyardStateValue) {
    GraveyardStateValue["Expanded"] = "EXPANDED";
    GraveyardStateValue["Collapsed"] = "COLLAPSED";
})(GraveyardStateValue || (GraveyardStateValue = {}));
export var CheckedListItemsPolicyValue;
(function (CheckedListItemsPolicyValue) {
    CheckedListItemsPolicyValue["Default"] = "DEFAULT";
    CheckedListItemsPolicyValue["Graveyard"] = "GRAVEYARD";
})(CheckedListItemsPolicyValue || (CheckedListItemsPolicyValue = {}));
export var ShareRequestValue;
(function (ShareRequestValue) {
    ShareRequestValue["Add"] = "WR";
    ShareRequestValue["Remove"] = "RM";
})(ShareRequestValue || (ShareRequestValue = {}));
export var RoleValue;
(function (RoleValue) {
    RoleValue["Owner"] = "O";
    RoleValue["User"] = "W";
})(RoleValue || (RoleValue = {}));
//# sourceMappingURL=enums.js.map

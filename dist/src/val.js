"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = __importDefault(require("./type"));
const Val = {};
Val.is = function (v) {
    if (v === undefined) {
        return false;
    }
    if (v === null) {
        return true;
    } // null is a valid value (for "deletes")
    if (v === Infinity || v === -Infinity) {
        return false;
    } // Not supported by JSON
    // Using Type utilities for type checking
    if (type_1.default.text.is(v) ||
        type_1.default.bi.is(v) || // boolean
        type_1.default.num.is(v)) { // number (finite)
        return true; // Simple primitive values are valid
    }
    // Check if it's a soul relation (link)
    return !!Val.link.is(v); // Coerce result of Val.link.is (string | false) to boolean
};
Val.link = Val.rel = {
    _: '#', // The character used for soul property
    is: function (v) {
        // This is a placeholder and will be overwritten by the IIFE below.
        // TypeScript needs a compatible signature here.
        return false;
    },
    ify: function (t) {
        // Type.obj.put returns its first argument.
        // We need to ensure the return type matches GunSoulRelation.
        const relation = {};
        relation[Val.link._] = t;
        return relation;
        // Or, more simply if Type.obj.put is correctly typed:
        // return Type.obj.put({}, Val.link._, t) as GunSoulRelation;
    }
};
// IIFE to define the actual Val.link.is logic
(function () {
    // Callback for Type.obj.map, 'this' will be MapLinkContext
    function mapCallbackForLinkIs(s_val, k_key /*, t_collector: CollectorFunction - t is not used */) {
        if (this.id === false) { // If already marked invalid, no further processing
            return;
        }
        if (k_key === Val.link._ && type_1.default.text.is(s_val)) { // Key is '#' and value is a string
            if (this.id !== undefined) { // Found '#', but id was already set (meaning multiple '#' or other properties came first)
                this.id = false; // Mark as invalid
                return;
            }
            this.id = s_val; // Potential soul found
        }
        else {
            // Any other property key means it's not a pure soul link object
            this.id = false; // Mark as invalid
            return;
        }
    }
    Val.link.is = function (v) {
        // A valid link must be an object, have a soul property (Val.link._ which is '#'),
        // and no GUN metadata property `_` (original code: !v._).
        if (v && type_1.default.obj.is(v) && v[Val.link._] && v['_'] === undefined) {
            const context = {}; // Context for mapCallbackForLinkIs
            // Type.obj.map will iterate over properties of `v`.
            // mapCallbackForLinkIs will be called for each property.
            // The third argument to Type.obj.map is the context for the callback.
            type_1.default.obj.map(v, mapCallbackForLinkIs, context);
            // After iteration, if context.id is a string, it's a valid soul.
            // If context.id became false or was never set to a string, it's invalid.
            if (context.id && type_1.default.text.is(context.id)) {
                return context.id; // Return the soul string
            }
        }
        return false; // Not a valid link
    };
}());
// The line `Type.obj.has._ = '.';` from the original JS was a direct modification
// of a function object (`Type.obj.has`) by adding a property `_` to it.
// This is highly unconventional and likely a bug or a very obscure feature not used
// within this val.js module itself. It's generally unsafe and not type-friendly.
// If this property is truly needed by other parts of GUN that consume `Type.obj.has`,
// then `Type.obj.has` would need to be declared with an optional `_` property in type.ts.
// For the scope of converting val.js, and given it's not used here, it's omitted.
// If it were to be included, it would look like:
// (Type.obj.has as any)._ = '.';
exports.default = Val;

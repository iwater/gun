"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = __importDefault(require("./type")); // Assuming Type is the default export from type.ts
function Dup(opt) {
    const dup = {
        s: {},
        check: function (id) {
            // `this` context will be bound correctly by assigning to dup instance methods
            if (!this.s[id]) {
                return false;
            }
            // dt will be defined below and assigned to dup.track, using the correct closure
            return this.track(id);
        },
        track: function (id) {
            // This initial track is a placeholder, it will be overwritten by `dt`
            // which has the correct closure over `s` (aliased from `dup.s`) and `dup.to`.
            // This is a bit of a workaround for the self-referential assignment pattern in JS.
            const it = this.s[id] || (this.s[id] = { was: 0 });
            it.was = +new Date();
            if (!this.to) {
                this.to = setTimeout(() => this.drop(), (options.age || 0) + 9);
            }
            return it;
        },
        drop: function (age) {
            const now = +new Date();
            // Corrected callback for Type.obj.map
            type_1.default.obj.map(this.s, (it, id, t) => {
                // `t` is the collector function from Type.obj.map, may not be used here
                if (it && (age || options.age || 0) > (now - it.was)) {
                    return;
                }
                delete this.s[id];
            }, this); // Passing `this` as context for the callback if Type.obj.map uses it
            this.to = null;
            if (typeof console !== 'undefined' && console.STAT) {
                const dropDuration = +new Date() - now;
                if (dropDuration > 9) {
                    console.STAT(now, dropDuration, 'dup drop');
                }
            }
        },
        to: null,
    };
    const s = dup.s;
    const options = {
        max: (opt === null || opt === void 0 ? void 0 : opt.max) || 1000,
        age: (opt === null || opt === void 0 ? void 0 : opt.age) || 1000 * 9 * 3, // Default from original JS: 1000 * 9 * 3
    };
    // dt captures `s` and `dup` in its closure.
    const dt = function (id) {
        const it = s[id] || (s[id] = { was: 0 }); // `s` is from Dup's scope
        it.was = +new Date();
        if (!dup.to) { // `dup.to` is from Dup's scope
            // Arrow function for drop to preserve `dup` as `this` context if drop uses it directly
            dup.to = setTimeout(() => dup.drop(), options.age + 9);
        }
        return it;
    };
    // Now correctly assign methods that use the `dt` closure or need `dup` context
    dup.check = function (id) {
        if (!s[id]) {
            return false;
        } // `s` from closure
        return dt(id); // `dt` from closure
    };
    dup.track = dt; // `dt` is the actual track function
    return dup;
}
exports.default = Dup;

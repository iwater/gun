"use strict";
// Generic javascript utilities.
Object.defineProperty(exports, "__esModule", { value: true });
const Type = {};
Type.fn = { is: function (fn) { return (!!fn && typeof fn === 'function'); } };
Type.bi = { is: function (b) { return (b instanceof Boolean || typeof b === 'boolean'); } };
Type.num = { is: function (n) { return !(n instanceof Array) && !!((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n); } };
Type.text = {};
Type.text.is = function (t) { return (typeof t === 'string'); };
Type.text.ify = function (t) {
    if (Type.text.is(t)) {
        return t;
    }
    if (typeof JSON !== "undefined") {
        return JSON.stringify(t);
    }
    return (t && t.toString) ? t.toString() : String(t);
};
Type.text.random = function (l, c) {
    var s = '';
    l = l || 24;
    c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
    while (l > 0) {
        s += c.charAt(Math.floor(Math.random() * c.length));
        l--;
    }
    return s;
};
Type.text.match = function (t, o) {
    let tmp;
    const u = undefined;
    if (typeof t !== 'string') {
        return false;
    }
    if (typeof o === 'string') {
        o = { '=': o };
    }
    o = o || {};
    tmp = (o['='] || o['*'] || o['>'] || o['<']);
    if (t === tmp) {
        return true;
    }
    if (u !== o['=']) {
        return false;
    }
    tmp = (o['*'] || o['>'] || o['<']);
    if (tmp !== undefined && t.slice(0, tmp.length) === tmp) {
        return true;
    }
    if (u !== o['*']) {
        return false;
    }
    const oValGt = o['>'];
    const oValLt = o['<'];
    if (u !== oValGt && u !== oValLt) {
        return (t >= oValGt && t <= oValLt);
    }
    if (u !== oValGt && t >= oValGt) {
        return true;
    }
    if (u !== oValLt && t <= oValLt) {
        return true;
    }
    return false;
};
Type.text.hash = function (s, c) {
    if (typeof s !== 'string') {
        return undefined;
    }
    c = c || 0;
    if (!s.length) {
        return c;
    }
    for (var i = 0, l = s.length, n; i < l; ++i) {
        n = s.charCodeAt(i);
        c = ((c << 5) - c) + n;
        c |= 0;
    }
    return c;
};
Type.list = {};
Type.list.is = function (l) { return (l instanceof Array); };
Type.list.slit = Array.prototype.slice;
Type.list.sort = function (k) {
    return function (A, B) {
        if (!A || !B) {
            return 0;
        }
        let valA = A[k];
        let valB = B[k];
        if (valA < valB) {
            return -1;
        }
        else if (valA > valB) {
            return 1;
        }
        else {
            return 0;
        }
    };
};
Type.list.index = 1;
Type.obj = {};
Type.obj.is = function (o) {
    var _a;
    return o ? (o instanceof Object && o.constructor === Object) || ((_a = Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)) === null || _a === void 0 ? void 0 : _a[1]) === 'Object' : false;
};
Type.obj.put = function (o, k, v) {
    const res = (o || {});
    res[k] = v;
    return res;
};
Type.obj.has = function (o, k) {
    return !!(o && Object.prototype.hasOwnProperty.call(o, k));
};
Type.obj.del = function (o, k) {
    if (!o) {
        return undefined;
    }
    o[k] = null;
    delete o[k];
    return o;
};
Type.obj.as = function (o, k, v, u) {
    return o[k] = o[k] || (u === v ? {} : v);
};
Type.obj.ify = function (o) {
    if (Type.obj.is(o)) {
        return o;
    }
    try {
        o = JSON.parse(o);
    }
    catch (e) {
        o = {};
    }
    if (!Type.obj.is(o)) {
        o = {};
    }
    return o;
};
(function () {
    const u = undefined;
    function map_to_internal(v, k) {
        if (Type.obj.has(this, k) && u !== this[k]) {
            return;
        }
        this[k] = v;
    }
    Type.obj.to = function (from, to) {
        to = to || {};
        Type.obj.map(from, map_to_internal, to);
        return to;
    };
}());
Type.obj.copy = function (o) {
    return !o ? o : JSON.parse(JSON.stringify(o));
};
(function () {
    const u = undefined;
    function empty_internal(v, i) {
        var n = this.n;
        if (n && (i === n || (Type.obj.is(n) && Type.obj.has(n, i)))) {
            return;
        }
        if (u !== i) {
            return true;
        }
    }
    Type.obj.empty = function (o, n) {
        if (!o) {
            return true;
        }
        return Type.obj.map(o, empty_internal, { n: n }) ? false : true;
    };
}());
// This IIFE defines Type.obj.map
;
(function () {
    const t_collector = function (k_or_v, v_val) {
        if (2 === arguments.length) {
            t_collector.r = t_collector.r || {};
            if (typeof k_or_v === 'string' || typeof k_or_v === 'number') {
                t_collector.r[k_or_v] = v_val;
            }
            return;
        }
        t_collector.r = t_collector.r || [];
        if (!Array.isArray(t_collector.r)) {
            t_collector.r = [];
        }
        t_collector.r.push(k_or_v);
    };
    var ObjUtilKeys = Object.keys;
    var u;
    var internalObjectKeys = ObjUtilKeys || function (o_val) {
        return Type.obj.map(o_val, (v_item, k_item, collector_fn) => { collector_fn(k_item); }, {});
    };
    Type.obj.map = function (list, callback, context) {
        var i = 0, x, r, keys_list, keys_list_exists;
        var is_func_callback = typeof callback === 'function';
        t_collector.r = undefined;
        if (ObjUtilKeys && Type.obj.is(list)) {
            keys_list = ObjUtilKeys(list);
            keys_list_exists = true;
        }
        else if (!ObjUtilKeys && Type.obj.is(list)) {
            keys_list = internalObjectKeys(list);
            keys_list_exists = true;
        }
        context = context || {};
        if (Type.list.is(list) || keys_list_exists) {
            x = (keys_list || list).length;
            for (i = 0; i < x; i++) {
                var current_key_for_list = keys_list_exists ? keys_list[i] : (Number(i) + Type.list.index);
                var current_val_for_list = keys_list_exists ? list[keys_list[i]] : list[i];
                if (is_func_callback) {
                    r = callback.call(context, current_val_for_list, current_key_for_list, t_collector);
                    if (r !== u) {
                        return r;
                    }
                }
                else {
                    if (callback === current_val_for_list) {
                        return current_key_for_list;
                    }
                }
            }
        }
        else {
            for (i in list) {
                if (Type.obj.has(list, i)) {
                    if (is_func_callback) {
                        r = callback.call(context, list[i], i, t_collector);
                        if (r !== u) {
                            return r;
                        }
                    }
                    else {
                        if (callback === list[i]) {
                            return i;
                        }
                    }
                }
            }
        }
        return is_func_callback ? t_collector.r : (Type.list.index ? 0 : -1);
    };
}());
Type.list.map = function (l, c, _) {
    return Type.obj.map(l, c, _);
};
Type.num.is = function (n) { return !Type.list.is(n) && !!((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n); };
Type.time = {};
Type.time.is = function (t) {
    return t instanceof Date;
};
exports.default = Type;

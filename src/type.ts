// Generic javascript utilities.

interface TextUtil {
  is: (t: any) => t is string;
  ify: (t: any) => string;
  random: (l?: number, c?: string) => string;
  match: (t: string, o: Record<string, string> | string) => boolean;
  hash: (s: string, c?: number) => number | undefined;
}

// Adjusted MapReturn type for obj.map and list.map
type MapReturn<MapResult> = MapResult | Array<MapResult> | string | number | Array<string | number> | Record<string, any> | undefined;

interface ListUtil<T = any> {
  is: (l: any) => l is Array<T>;
  slit: <U>(this: Array<U>, ...args: any[]) => Array<U>;
  sort: <U extends Record<string, any>>(k: keyof U) => (A: U, B: U) => number;
  map: <U, V>(l: Array<U> | Record<string, U>, c: ((val: U, key: string | number, t: CollectorFunction) => V) | U, _: any) => MapReturn<V>;
  index: number;
}

interface ObjUtil {
  is: (o: any) => o is Record<string, any>;
  put: <O extends Record<string, any>, K extends string, V>(o: O | null | undefined, k: K, v: V) => O & Record<K, V>;
  has: <T extends Record<string, any>, K extends string | number | symbol>(o: T | null | undefined, k: K) => o is T & Record<K, any>;
  del: <T extends Record<string, any>, K extends keyof T>(o: T | null | undefined, k: K) => T | undefined;
  as: <O extends Record<string, any>, K extends string, V>(o: O, k: K, v: V, u?: any) => V | Record<string, never>;
  ify: (o: any) => Record<string, any>;
  to: <F extends Record<string, any>, T extends Record<string, any>>(from: F, to?: T) => T & F;
  copy: <T extends Record<string, any>>(o: T | null | undefined) => T | null | undefined;
  empty: <T extends Record<string, any>>(o: T | null | undefined, n?: string | Record<string, any>) => boolean;
  map: <Target, MapResult>(
    list: Array<Target> | Record<string, Target>,
    callback: ((val: Target, key: string | number, t: CollectorFunction) => MapResult) | Target,
    context: any
  ) => MapReturn<MapResult>;
}

interface TypeUtil {
  fn: {
    is: (fn: any) => fn is (...args: any[]) => any;
  };
  bi: {
    is: (b: any) => b is boolean;
  };
  num: {
    is: (n: any) => n is number;
  };
  text: TextUtil;
  list: ListUtil;
  obj: ObjUtil;
  time: {
    is: (t?: any) => t is Date; 
  };
}

// Exporting CollectorFunction
export type CollectorFunction = {
    (k: string | number, v: any): void;
    (k: string | number): void;
    r?: Record<string, any> | Array<string | number>;
};


const Type: TypeUtil = {} as TypeUtil;

Type.fn = {is: function(fn: any): fn is (...args: any[]) => any { return (!!fn && typeof fn === 'function') }}
Type.bi = {is: function(b: any): b is boolean { return (b instanceof Boolean || typeof b === 'boolean') }}
Type.num = {is: function(n: any): n is number { return !(n instanceof Array) && !!((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }}

Type.text = {} as TextUtil;
Type.text.is = function(t: any): t is string { return (typeof t === 'string') }
Type.text.ify = function(t: any): string {
	if(Type.text.is(t)){ return t }
	if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
	return (t && t.toString)? t.toString() : String(t);
}
Type.text.random = function(l?: number, c?: string): string {
	var s = '';
	l = l || 24;
	c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
	while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l-- }
	return s;
}
Type.text.match = function(t: string, o: Record<string, string> | string): boolean {
    let tmp: string | undefined;
    const u: undefined = undefined;
	if(typeof t !== 'string'){ return false } 
	if(typeof o === 'string'){ o = {'=': o} }
	o = o || {}; 
    
    tmp = (o['='] || o['*'] || o['>'] || o['<']);
	if(t === tmp){ return true }
	if(u !== o['=']){ return false }

	tmp = (o['*'] || o['>'] || o['<']);
	if (tmp !== undefined && t.slice(0, tmp.length) === tmp) { return true; }
	if(u !== o['*']){ return false }

    const oValGt = o['>'];
    const oValLt = o['<'];

	if(u !== oValGt && u !== oValLt){ 
		return (t >= oValGt && t <= oValLt);
	}
	if(u !== oValGt && t >= oValGt){ return true } 
	if(u !== oValLt && t <= oValLt){ return true } 
	return false;
}
Type.text.hash = function(s: string, c?: number): number | undefined {
	if(typeof s !== 'string'){ return undefined } 
	    c = c || 0;
	    if(!s.length){ return c }
	    for(var i=0,l=s.length,n; i<l; ++i){
	      n = s.charCodeAt(i);
	      c = ((c<<5)-c)+n;
	      c |= 0;
	    }
	    return c;
	  }

Type.list = {} as ListUtil;
Type.list.is = function<T>(l: any): l is Array<T> { return (l instanceof Array) }
Type.list.slit = Array.prototype.slice;
Type.list.sort = function<T extends Record<string, any>>(k: keyof T) {
	return function(A: T, B: T): number {
		if(!A || !B){ return 0 } 
        let valA = A[k]; 
        let valB = B[k];
		if(valA < valB){ return -1 }else if(valA > valB){ return 1 } 
		else { return 0 }
	}
}

Type.list.index = 1;

Type.obj = {} as ObjUtil;
Type.obj.is = function(o: any): o is Record<string, any> { 
    return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)?.[1] === 'Object' : false 
}
Type.obj.put = function<O extends Record<string, any>, K extends string, V>(o: O | null | undefined, k: K, v: V): O & Record<K,V> { 
    const res = (o || {}) as O & Record<K,V>;
    (res as any)[k] = v; 
    return res;
}
Type.obj.has = function<T extends Record<string, any>, K extends string | number | symbol>(o: T | null | undefined, k: K): o is T & Record<K, any> { 
    return !!(o && Object.prototype.hasOwnProperty.call(o, k)) 
}
Type.obj.del = function<T extends Record<string, any>, K extends keyof T>(o: T | null | undefined, k: K): T | undefined {
	if(!o){ return undefined }
	(o as any)[k] = null; 
	delete o[k];
	return o;
}
Type.obj.as = function<O extends Record<string, any>, K extends string, V>(o: O, k: K, v: V, u?: any): V | Record<string, never> { 
    return (o as any)[k] = (o as any)[k] || (u === v? {} : v);
}
Type.obj.ify = function(o: any): Record<string, any> {
	if(Type.obj.is(o)){ return o }
	try{o = JSON.parse(o);
	}catch(e){o={};}
	if(!Type.obj.is(o)) { o = {}; } 
	return o;
}

;(function(){ 
    const u: undefined = undefined;
	function map_to_internal<V, K extends string>(this: Record<K, V>, v: V,k: K){ 
		if(Type.obj.has(this,k) && u !== this[k]){ return }
		this[k] = v;
	}
	Type.obj.to = function<F extends Record<string, any>, T extends Record<string, any>>(from: F, to?: T): T & F {
		to = to || {} as T;
		Type.obj.map(from, map_to_internal as any, to); 
		return to as T & F;
	}
}());

Type.obj.copy = function<T extends Record<string, any>>(o: T | null | undefined): T | null | undefined { 
	return !o? o : JSON.parse(JSON.stringify(o));
}

;(function(){
    const u: undefined = undefined;
    interface EmptyContext<N> { n?: N }
	function empty_internal<V, I extends string, N extends I | Record<I, any>>(this: EmptyContext<N>, v: V,i: I): boolean | void { 
        var n = this.n;
		if(n && (i === n || (Type.obj.is(n) && Type.obj.has(n, i)))){ return } 
		if(u !== i){ return true } 
	}
	Type.obj.empty = function<T extends Record<string, any>>(o: T | null | undefined, n?: string | Record<string, any>): boolean {
		if(!o){ return true } 
		return Type.obj.map(o, empty_internal as any, {n:n}) ? false : true;
	}
}());

// This IIFE defines Type.obj.map
;(function(){
	const t_collector: CollectorFunction = function(k_or_v: string | number, v_val?: any){
		if(2 === arguments.length){
			t_collector.r = t_collector.r || {};
            if (typeof k_or_v === 'string' || typeof k_or_v === 'number') {
                 (t_collector.r as Record<string | number, any>)[k_or_v] = v_val;
            }
			return;
		} 
        t_collector.r = t_collector.r || [];
        if (!Array.isArray(t_collector.r)) { t_collector.r = []; } 
		(t_collector.r as Array<string | number>).push(k_or_v);
	};

	var ObjUtilKeys = Object.keys; 
    var u: undefined;
	
    var internalObjectKeys = ObjUtilKeys || function(o_val: Record<string,any>): string[] { 
        return Type.obj.map(o_val, (v_item: any, k_item: string | number, collector_fn: CollectorFunction) => { collector_fn(k_item); }, {}) as string[];
    };

	Type.obj.map = function<Target, MapResult>(
        list: Array<Target> | Record<string, Target>, 
        callback: ((val: Target, key: string | number, t: CollectorFunction) => MapResult) | Target, 
        context: any 
    ): MapReturn<MapResult> { 
		var i: string | number = 0, x: number, r: MapResult | undefined, keys_list: string[] | undefined, keys_list_exists: boolean | undefined;
        var is_func_callback = typeof callback === 'function';
		t_collector.r = undefined; 

		if(ObjUtilKeys && Type.obj.is(list)){ 
			keys_list = ObjUtilKeys(list as Record<string, Target>); keys_list_exists = true;
		} else if (!ObjUtilKeys && Type.obj.is(list)) { 
            keys_list = internalObjectKeys(list as Record<string, Target>); 
            keys_list_exists = true;
        }

		context = context || {};

		if(Type.list.is(list) || keys_list_exists){ 
			x = (keys_list || list as Array<Target>).length; 
			for(i = 0;i < x; i++){ 
				var current_key_for_list: string | number = keys_list_exists ? keys_list![i] : (Number(i) + Type.list.index);
                var current_val_for_list: Target = keys_list_exists ? (list as Record<string, Target>)[keys_list![i]] : (list as Array<Target>)[i];

				if(is_func_callback){
					r = (callback as Function).call(context, current_val_for_list, current_key_for_list, t_collector);
					if(r !== u){ return r; } 
				} else { 
					if(callback === current_val_for_list){ return current_key_for_list; } 
				}
			}
		} else { 
			for(i in list){ 
				if(Type.obj.has(list,i)){ 
                    if(is_func_callback){
                        r = (callback as Function).call(context, (list as Record<string,Target>)[i as string], i, t_collector); 
                        if(r !== u){ return r; } 
                    } else {  
                        if(callback === (list as Record<string,Target>)[i as string]){ return i; } 
                    }
                }
			}
		}
		return is_func_callback? t_collector.r : (Type.list.index? 0 : -1); 
	}
}());


Type.list.map = function<U, V>(l: Array<U> | Record<string, U>, c: ((val: U, key: string | number, t: CollectorFunction) => V) | U, _: any): MapReturn<V> { 
    return Type.obj.map(l, c, _);
}
Type.num.is = function(n: any): n is number { return !Type.list.is(n) && !!((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }


Type.time = {} as TypeUtil['time'];
Type.time.is = function(t?: any): t is Date { 
    return t instanceof Date;
}

export default Type;

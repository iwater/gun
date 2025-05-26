import Type from './type';
// Since node.js is not converted, Node will be 'any'
// We'll use a placeholder type for Node-like structures
const Node = require('./node'); 

type GunNode = Record<string, any> & {
  _?: {
    '>'?: Record<string, number>;
    // Other Node metadata properties if known
    '#'?: string; // For soul
  };
};

// Define the main State function and its static properties/methods
interface StateInterface {
  (): number; // Main function signature
  drift: number;
  _: string; // Static property, should be '>'
  is: (n: GunNode | null | undefined, k: string, o?: any) => number; // Return type changed to number as per JS logic (falls back to -Infinity)
  lex: () => string;
  ify: (n: GunNode | string | null | undefined, k?: string, s?: number, v?: any, soul?: string) => GunNode | undefined;
  to: (from: GunNode | null | undefined, k: string, to?: GunNode | string) => GunNode | undefined;
  map: {
    (cb: ((v: any, k: string, o: GunNode, opt: any) => void) | GunNode, s?: number | GunNode, as?: any): GunNode | ((v: any, k: string, o: GunNode, opt: any) => any);
    // Overload for the case where only (o, s) is passed
    (o: GunNode, s?: number): GunNode;
  }
}

let last: number = -Infinity;
let N: number = 0;
const D_resolution: number = 1000; // Renamed from D to avoid conflict if D is used elsewhere, and for clarity
const perf = (typeof performance !== 'undefined')? (performance.timing && performance) : false;
const start = (perf && perf.timing && perf.timing.navigationStart) || 0; 

// Temporary variable for drift until State.drift is assigned.
let currentDrift = 0;

const StateInternal: () => number = function State(): number {
  let t: number;
  if (perf) {
    t = start + performance.now(); 
  } else {
    t = +new Date;
  }
  if (last < t) {
    N = 0;
    last = t + currentDrift; // Use currentDrift
    return last;
  }
  last = t + ((N += 1) / D_resolution) + currentDrift; // Use currentDrift
  return last;
};

const State = StateInternal as StateInterface;

State._ = '>'; // Static property assignment
State.drift = 0; // Actual assignment to State.drift
currentDrift = State.drift; // Update currentDrift to reflect the assigned State.drift

// Placeholder for Node._, assuming it's typically the soul key '#' or graph key '>'
// In the original code, N_ is Node._ which is not defined in node.js, so it would be undefined.
// The code then defaults S_ to State._ which is '>'.
// State.is uses n[N_][S_], which implies N_ should be the metadata key (like '_').
// Let's assume Node._ refers to the metadata key, typically '_'.
// The original JS `var N_ = Node._, u;` means N_ would be `undefined` if `Node._` is not set.
// However, the usage `n[N_]` implies N_ is a key.
// The original `State.ify` checks `if(!n || !n[N_])`. If N_ is undefined, `n[undefined]` is problematic.
// The most logical interpretation is that N_ refers to the metadata key, conventionally `_`.
// If `Node._` was a specific property on the Node module (like `Node._soulKey = '#'`), that would be different.
// Given the usage `n[N_][S_]`, N_ must be the key for the metadata object, and S_ (State._) is '>'
const METADATA_KEY = '_'; // Standard metadata key for GUN nodes

State.is = function(n: GunNode | null | undefined, k: string, o?: any): number {
  // o is an optional fallback for n[METADATA_KEY][State._]
  const meta = n && n[METADATA_KEY];
  const states = meta && meta[State._]; // meta['>']
  const tmp = states || o; // If states itself is the fallback (o)
  
  if (!tmp) { return -Infinity; } // If no states object or fallback, return -Infinity
  const stateVal = tmp[k];
  return Type.num.is(stateVal) ? stateVal : -Infinity;
};

State.lex = function(): string {
  return State().toString(36).replace('.', ''); // State() here will use the updated currentDrift
};

State.ify = function(n: GunNode | string | null | undefined, k?: string, s?: number, v?: any, soul?: string): GunNode | undefined {
  let nodeToModify: GunNode | undefined;

  // Ensure 'n' is a node object.
  if (!n || !Type.obj.is(n) || !(n as GunNode)[METADATA_KEY]) {
    if (!soul) {
      return undefined;
    }
    // Node.soul.ify is 'any', result is 'any', cast to GunNode
    // Ensure Node.soul.ify can handle n being string or object.
    nodeToModify = Node.soul.ify(n, soul) as GunNode; 
    if (!nodeToModify) return undefined; 
  } else {
    nodeToModify = n as GunNode;
  }
  
  // Ensure metadata structure `_` and state holder `_['>']` exist.
  const meta = Type.obj.as(nodeToModify, METADATA_KEY, {} as GunNode['_']);
  const states = Type.obj.as(meta, State._, {} as Record<string, number>);

  if (k !== undefined && k !== METADATA_KEY) { // k should not be the metadata key itself
    if (Type.num.is(s)) {
      states[k] = s as number;
    }
    if (v !== undefined) { 
      nodeToModify[k] = v;
    }
  }
  return nodeToModify;
};

State.to = function(from: GunNode | null | undefined, k: string, to?: GunNode | string): GunNode | undefined {
  if (!from) return undefined;
  let val = from[k];
  if (Type.obj.is(val)) {
    val = Type.obj.copy(val); // Deep copy if object
  }
  // Node.soul is 'any', result is 'any'
  const soul = Node.soul(from) as string | undefined; 
  return State.ify(to, k, State.is(from, k), val, soul);
};

;(function() {
  // map_internal needs to be defined before being used in stateMap's overload logic
  function map_internal(this: { o: GunNode, s: number }, v: any, k: string): void {
    if (METADATA_KEY === k) { return; } // Do not process metadata key itself
    State.ify(this.o, k, this.s); // `this.s` is the state (timestamp)
  }

  function stateMap(cbOrO: ((v: any, k: string, o: GunNode, opt: any) => void) | GunNode, sVal?: number | GunNode, asOpt?: any): GunNode | ((v: any, k: string, o: GunNode, opt: any) => any);
  function stateMap(o: GunNode, s?: number): GunNode; // Overload for (o, s)

  function stateMap(
    cbOrO: ((v: any, k: string, o: GunNode, opt: any) => void) | GunNode, 
    sVal?: number | GunNode, 
    asOpt?: any
  ): GunNode | ((v: any, k: string, o: GunNode, opt: any) => any) {
    
    const oNode = Type.obj.is(cbOrO) ? cbOrO as GunNode : null;
    const cbFunc = Type.fn.is(cbOrO) ? cbOrO as ((v: any, k: string, o: GunNode, opt: any) => void) : null;

    if (oNode && !cbFunc) { // Case: State.map(o, s)
      const stateToSet = Type.num.is(sVal) ? sVal as number : State();
      // Ensure metadata holder exists for the node
      Type.obj.as(oNode, METADATA_KEY, {}); 
      Type.obj.map(oNode, map_internal, { o: oNode, s: stateToSet });
      return oNode;
    }

    // Case: State.map(cb, s, as) or State.map(cb, as) or State.map(cb)
    const asContext = asOpt || (Type.obj.is(sVal) ? sVal as GunNode : undefined);
    const stateToSet = Type.num.is(sVal) ? sVal as number : State();
    
    return function(this: any, v_val: any, k_key: string, o_passed_node: GunNode, opt_options: any) {
      if (!cbFunc) { // Should not happen if logic above is correct, but as a fallback
        map_internal.call({ o: o_passed_node, s: stateToSet }, v_val, k_key);
        return v_val; // Original map returns the value if no cb
      }
      // Execute the callback
      cbFunc.call(asContext || this || {}, v_val, k_key, o_passed_node, opt_options);
      
      // If the callback deleted the property (by setting it to undefined), do not add state for it.
      if (Type.obj.has(o_passed_node, k_key) && o_passed_node[k_key] === undefined) { return; }
      
      // Add state to the key on the passed node
      map_internal.call({ o: o_passed_node, s: stateToSet }, v_val, k_key);
    };
  }
  State.map = stateMap as StateInterface['map'];
}());

export default State;

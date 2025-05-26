import Type from './type'; // Assuming Type is the default export from type.ts
import type { CollectorFunction as TypeCollectorFunction } from './type'; // Import if needed for explicit typing

interface DupOptions {
  max?: number; 
  age?: number;
}

interface DupItem {
  was: number; // Timestamp
}

interface DupState {
  [id: string]: DupItem | undefined; 
}

interface DupInstance {
  s: DupState;
  check: (id: string) => DupItem | false;
  track: (id: string) => DupItem;
  drop: (age?: number) => void;
  to?: NodeJS.Timeout | null; 
}

function Dup(opt?: DupOptions): DupInstance {
  const dup: DupInstance = {
    s: {},
    check: function(this: DupInstance, id: string): DupItem | false {
      // `this` context will be bound correctly by assigning to dup instance methods
      if (!this.s[id]) { return false; }
      // dt will be defined below and assigned to dup.track, using the correct closure
      return (this.track as (id: string) => DupItem)(id); 
    },
    track: function(this: DupInstance, id: string): DupItem { 
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
    drop: function(this: DupInstance, age?: number): void {
      const now = +new Date();
      // Corrected callback for Type.obj.map
      Type.obj.map(this.s, (it: DupItem | undefined, id: string | number, t: TypeCollectorFunction) => {
        // `t` is the collector function from Type.obj.map, may not be used here
        if (it && (age || options.age || 0) > (now - it.was)) { return; }
        delete this.s[id as string]; 
      }, this); // Passing `this` as context for the callback if Type.obj.map uses it
      
      this.to = null;
      
      if (typeof console !== 'undefined' && (console as any).STAT) {
        const dropDuration = +new Date() - now;
        if (dropDuration > 9) {
            (console as any).STAT(now, dropDuration, 'dup drop');
        }
      }
    },
    to: null,
  };

  const s = dup.s; 

  const options: Required<DupOptions> = {
    max: opt?.max || 1000, 
    age: opt?.age || 1000 * 9 * 3, // Default from original JS: 1000 * 9 * 3
  };

  // dt captures `s` and `dup` in its closure.
  const dt = function(id: string): DupItem {
    const it = s[id] || (s[id] = { was: 0 }); // `s` is from Dup's scope
    it.was = +new Date();
    if (!dup.to) { // `dup.to` is from Dup's scope
      // Arrow function for drop to preserve `dup` as `this` context if drop uses it directly
      dup.to = setTimeout(() => dup.drop(), options.age + 9); 
    }
    return it;
  };

  // Now correctly assign methods that use the `dt` closure or need `dup` context
  dup.check = function(id: string): DupItem | false {
    if (!s[id]) { return false; } // `s` from closure
    return dt(id); // `dt` from closure
  };
  dup.track = dt; // `dt` is the actual track function

  return dup;
}

export default Dup;

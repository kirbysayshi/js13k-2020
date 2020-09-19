export type EntityId = { id: number };

function isEntityId(obj: any): obj is EntityId {
  return obj && typeof obj === "object" && typeof obj.id === "number";
}

type EntityData = {
  k: string;
};

// https://stackoverflow.com/a/50499316
export type NarrowComponent<T, N> = T extends { k: N } ? T : never;

export type AssuredEntityId<ED extends EntityData> = EntityId & {
  _assured: ED;
};

export class CES2<ED extends EntityData> {
  // starting at 1 to avoid any falsy ids
  private lastId = 1;

  private byCmp = new Map<ED["k"], { id: EntityId; d: ED }[]>();
  private byId = new Map<EntityId, ED[]>();

  // destroyNext
  private dn = new Set<EntityId>();

  constructor() {}

  // make an entity
  entity(initData: ED[]) {
    const id = { id: this.lastId++ };

    for (let i = 0; i < initData.length; i++) {
      const data = initData[i];

      // byComponent
      const cmpDataList = this.byCmp.get(data.k) ?? [];
      cmpDataList.push({ id, d: data });
      this.byCmp.set(data.k, cmpDataList);

      // byId
      const entityDataList = this.byId.get(id) ?? [];
      entityDataList.push(data);
      this.byId.set(id, entityDataList);
    }

    // strongly-typed ids
    return id as AssuredEntityId<
      NarrowComponent<ED, typeof initData[number]["k"]>
    >;
  }

  // get all data for a component type
  // select entity ids by a single component type
  select<T extends ED["k"]>(kind: T) {
    const datas = this.byCmp.get(kind) ?? [];
    return datas as {
      id: AssuredEntityId<NarrowComponent<ED, T>>;
      d: NarrowComponent<ED, T>;
    }[];
  }

  /**
   * @deprecated
   */
  selectFirst<T extends ED["k"]>(kinds: T[]) {
    return this.byCmp.get(kinds[0]) as
      | AssuredEntityId<NarrowComponent<ED, T>>
      | undefined;
  }

  // get the first data for a component type
  selectFirstData<T extends ED["k"]>(kind: T) {
    const datas = this.byCmp.get(kind) ?? [];
    if (!datas.length) throw new Error(`ENOCMPDATA ${kind}`);
    return datas[0].d as NarrowComponent<ED, T>;
  }

  data<T extends ED, K extends T["k"]>(id: AssuredEntityId<T>, kind: K) {
    const datas = this.byId.get(id);
    if (process.env.NODE_ENV !== "production") {
      if (!datas) throw new Error(`Entity(${id}) not found!`);
    }
    let found;
    for (let i = 0; i < datas!.length; i++) {
      const data = datas![i];
      if (data.k === kind) found = data;
    }
    return found as NarrowComponent<ED, K>;
  }

  // destroy
  destroy(id: EntityId) {
    this.dn.add(id);
  }

  isDestroyed(id: EntityId) {
    return this.dn.has(id);
  }

  // flushDestroy
  flushDestruction() {
    if (this.dn.size === 0) return;
    let reflush = false;

    const recurse = (obj: any) => {
      if (obj && typeof obj === "object" && !isEntityId(obj)) {
        Object.values(obj).forEach((value) => {
          if (isEntityId(value)) {
            this.destroy(value);
            reflush = true;
          } else {
            recurse(value);
          }
        });
      }
    };

    this.dn.forEach((id) => {
      this.dn.delete(id);
      if (!this.byId.has(id)) return;

      const datas = this.byId.get(id)!;

      // recursively traverse the entities referenced by this component
      // and mark them for deletion.
      datas.forEach((cmp) => {
        recurse(cmp);
      });

      // delete the entry by id
      this.byId.delete(id);

      // delete all component datas associated by traversing the entire collection...
      this.byCmp.forEach((collection) => {
        for (let i = 0; i < collection.length; i++) {
          const entry = collection[i];
          if (entry.id === id) {
            collection.splice(i, 1);
            i--;
          }
        }
      });
    });

    // We have found more entities to delete. Flush again!
    if (reflush) this.flushDestruction();
  }
}

// type C1 = {
//   k: "c1";
//   p1: number;
// };

// type C2 = {
//   k: "c2";
//   p2: string;
// };

// const ces = new CES2<C1 | C2>();

// const id = ces.entity([
//   { k: "c1", p1: 23 },
//   { k: "c2", p2: "hello" },
// ]);

// const c1s = ces.select("c1").forEach((result) => {
//   result.id;
// });

// const firstC1 = ces.selectFirstData("c1");

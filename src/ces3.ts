export type EntityId = { id: number };

function isEntityId(obj: any): obj is EntityId {
  return obj && typeof obj === "object" && typeof obj.id === "number";
}

export type NarrowComponent<T, N> = T extends { k: N } ? T : never;
export type AssuredEntityId<ED extends EntityData> = EntityId & {
  _assured: ED;
};

type EntityData = {
  k: string;
};

export class CES3<ED extends EntityData> {
  private lastId = -1;

  private ids = new Set<number>();
  private destroyed = new Set<number>();

  // the index of each array is the entity id
  private cmpToIdArr = new Map<ED["k"], (ED | undefined)[]>();

  constructor(private maxDataCount = 100) {}

  private nextId(): EntityId {
    while (true) {
      let test = ++this.lastId;
      if (test < this.maxDataCount) {
        if (this.ids.has(test)) {
          continue;
        } else {
          this.ids.add(test);
          return { id: test };
        }
      } else {
        // expand and reset
        this.lastId = -1;
        const max = (this.maxDataCount = this.maxDataCount * 10);
        for (const [kind, datas] of this.cmpToIdArr) {
          const next = new Array(max);
          for (let i = 0; i < datas.length; i++) {
            next[i] = datas[i];
          }
          this.cmpToIdArr.set(kind, next);
        }
      }
    }
  }

  destroy(eid: EntityId) {
    this.destroyed.add(eid.id);
  }

  isDestroyed(eid: EntityId) {
    return this.destroyed.has(eid.id);
  }

  flushDestruction() {
    if (this.destroyed.size === 0) return;
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

    this.destroyed.forEach((id) => {
      this.destroyed.delete(id);
      this.ids.delete(id);

      for (const [, datas] of this.cmpToIdArr) {
        const data = datas[id];
        if (!data) continue;
        recurse(data);
        datas[id] = undefined;
      }
    });

    // We have found more entities to delete. Flush again!
    if (reflush) this.flushDestruction();
  }

  entity<T extends ED>(initData: T[]) {
    const eid = this.nextId();

    for (let i = 0; i < initData.length; i++) {
      const data = initData[i];
      this.add(eid as AssuredEntityId<NarrowComponent<ED, T["k"]>>, data);
    }

    return eid as AssuredEntityId<
      NarrowComponent<ED, typeof initData[number]["k"]>
    >;
  }

  // There is actually no guarantee the id is still valid, so this should return optional undefined...
  data<T extends ED, K extends T["k"]>(eid: AssuredEntityId<T>, kind: K) {
    const datas = this.cmpToIdArr.get(kind);
    if (process.env.NODE_ENV !== "production") {
      if (!datas) throw new Error("No component datas!");
    }
    return datas![eid.id] as NarrowComponent<T, K>;
  }

  add<T extends ED, Existing extends ED>(
    eid: AssuredEntityId<Existing>,
    initData: T
  ) {
    const datas = this.cmpToIdArr.get(initData.k) ?? Array(this.maxDataCount);
    // TODO: what if data already exists? Destroy?
    datas[eid.id] = initData;
    this.cmpToIdArr.set(initData.k, datas);
    // the id is now UPGRADED
    // return eid as AssuredEntityId<T>;
    return (eid as EntityId) as AssuredEntityId<
      NarrowComponent<ED, Existing["k"] | typeof initData["k"]>
    >;
  }

  remove<ExistingComponents extends ED>(
    eid: AssuredEntityId<ExistingComponents>,
    kind: ExistingComponents["k"]
  ) {
    const datas = this.cmpToIdArr.get(kind);
    if (!datas) return;
    datas[eid.id] = undefined;
    return eid as AssuredEntityId<
      Exclude<ExistingComponents["k"], typeof kind>
    >;
  }

  select<T extends ED["k"]>(kinds: T[]) {
    const matching = new Set<EntityId["id"]>();

    for (let i = 0; i < kinds.length; i++) {
      const kind = kinds[i];
      const datas = this.cmpToIdArr.get(kind);
      if (!datas) return [];
      if (matching.size !== 0) {
        for (let k = 0; k < datas.length; k++) {
          const data = datas[k];
          if (data !== undefined) matching.add(k);
        }
      } else {
        for (const id of matching.values()) {
          if (datas[id] === undefined) matching.delete(id);
        }
      }
    }

    return [...matching].map((v) => ({ id: v })) as AssuredEntityId<
      NarrowComponent<ED, T>
    >[];
  }

  selectFirst(kinds: ED["k"][]) {
    return this.select(kinds)[0];
  }

  selectFirstData<T extends ED["k"]>(kind: T) {
    const datas = this.cmpToIdArr.get(kind);
    if (process.env.NODE_ENV !== "production") {
      if (!datas) throw new Error("No component datas!");
    }
    for (let i = 0; i < datas!.length; i++) {
      const data = datas![i];
      if (data !== undefined) return data as NarrowComponent<ED, T>;
    }
  }
}

import { AssuredEntityId, CES3 } from "./ces3";

type C1 = {
  k: "c1";
  p1: number;
};

type C2 = {
  k: "c2";
  p2: string;
};

// https://2ality.com/2019/07/testing-static-types.html
type AssertIs<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never;

const ces = new CES3<C1 | C2>();

const id = ces.entity([
  { k: "c1", p1: 23 },
  { k: "c2", p2: "hello" },
]);

const t1: AssertIs<typeof id, AssuredEntityId<C1 | C2>> = true;

const id2 = ces.entity([{ k: "c2", p2: "hello" }]);

const t2: AssertIs<typeof id2, AssuredEntityId<C2>> = true;

ces.select(["c1"]).forEach((result) => {
  const t3: AssertIs<typeof result, AssuredEntityId<C1>> = true;
  const d = ces.data(result, "c1");
  const t4: AssertIs<typeof d, C1> = true;
  result.id;
});

const firstC1 = ces.selectFirstData("c1");
const t5: AssertIs<typeof firstC1, C1> = true;

const id22 = ces.add(id2, { k: "c1", p1: 23 });
const t6: AssertIs<typeof id22, AssuredEntityId<C1 | C2>> = true;

const assert = require("assert").strict;

{
  const ces = new CES3<C1 | C2>(5);

  const e0 = ces.entity([{ k: "c1", p1: 0 }]);
  const e1 = ces.entity([{ k: "c1", p1: 1 }]);
  const e2 = ces.entity([{ k: "c1", p1: 2 }]);
  const e3 = ces.entity([{ k: "c1", p1: 3 }]);
  const e4 = ces.entity([{ k: "c1", p1: 4 }]);

  assert.strictEqual(e0.id, 0, "e0");
  assert.strictEqual(e1.id, 1, "e1");
  assert.strictEqual(e2.id, 2, "e2");
  assert.strictEqual(e3.id, 3, "e3");
  assert.strictEqual(e4.id, 4, "e4");

  ces.destroy(e1);
  ces.flushDestruction();

  const e5 = ces.entity([{ k: "c1", p1: 5 }]);
  const e6 = ces.entity([{ k: "c1", p1: 6 }]);

  assert.strictEqual(e5.id, 1, "e5 reuses id 1");
  assert.strictEqual(e6.id, 5, "e6 uses newly allocated");

  assert.deepStrictEqual(ces.data(e0, "c1"), { k: "c1", p1: 0 });
}

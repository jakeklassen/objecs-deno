import { World } from "npm:miniplex";

type Entity = {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
};

export function simpleIter(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1, b: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1, b: 1, C: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1, b: 1, C: 1, D: 1 });
  }

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1, b: 1, C: 1, E: 1 });
  }

  const withAB = ecs.with("a", "b");
  const withCD = ecs.with("c", "d");
  const withCE = ecs.with("c", "e");

  return () => {
    for (const entity of withAB.entities) {
      const temp = entity.a;
      entity.a = entity.b;
      entity.b = temp;
    }

    for (const entity of withCD.entities) {
      const temp = entity.c;
      entity.c = entity.d;
      entity.d = temp;
    }

    for (const entity of withCE.entities) {
      const temp = entity.c;
      entity.c = entity.e;
      entity.e = temp;
    }
  };
}

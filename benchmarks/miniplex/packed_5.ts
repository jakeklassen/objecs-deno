import { World } from "npm:miniplex";

type Entity = {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
};

export function packed5(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1, b: 1, c: 1, d: 1, e: 1 });
  }

  const withA = ecs.with("a");
  const withB = ecs.with("b");
  const withC = ecs.with("c");
  const withD = ecs.with("d");
  const withE = ecs.with("e");

  return () => {
    for (const entity of withA.entities) {
      entity.a *= 2;
    }

    for (const entity of withB.entities) {
      entity.b *= 2;
    }

    for (const entity of withC.entities) {
      entity.c *= 2;
    }

    for (const entity of withD.entities) {
      entity.d *= 2;
    }

    for (const entity of withE.entities) {
      entity.e *= 2;
    }
  };
}

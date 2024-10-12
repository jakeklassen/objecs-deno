import { World } from "@gamedev/objecs";

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
    ecs.createEntity({ a: 1, b: 1, c: 1, d: 1, e: 1 });
  }

  const withA = ecs.archetype("a");
  const withB = ecs.archetype("b");
  const withC = ecs.archetype("c");
  const withD = ecs.archetype("d");
  const withE = ecs.archetype("e");

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

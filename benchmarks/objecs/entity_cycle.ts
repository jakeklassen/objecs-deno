import { World } from "@gamedev/objecs";

type Entity = {
  a?: number;
  b?: number;
};

export function entityCycle(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.createEntity({ a: 1 });
  }

  const withA = ecs.archetype("a");
  const withB = ecs.archetype("b");

  return () => {
    for (const _entity of withA.entities) {
      ecs.createEntity({ b: 1 });
    }

    for (const entity of withB.entities) {
      ecs.deleteEntity(entity);
    }
  };
}

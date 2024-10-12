import { World } from "npm:miniplex";

type Entity = {
  a?: number;
  b?: number;
};

export function entityCycle(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.add({ a: 1 });
  }

  const withA = ecs.with("a");
  const withB = ecs.with("b");

  return () => {
    for (const _entity of withA.entities) {
      ecs.add({ b: 1 });
    }

    for (let i = withB.entities.length; i > 0; i--) {
      const entity = withB.entities[i - 1];
      ecs.remove(entity);
    }
  };
}

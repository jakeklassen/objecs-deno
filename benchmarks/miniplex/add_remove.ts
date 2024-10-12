import { World } from "npm:miniplex";

type Entity = {
  a?: boolean;
  b?: boolean;
};

export function addRemove(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.add({ a: true });
  }

  return () => {
    for (const entity of ecs.entities) {
      ecs.addComponent(entity, "b", true);
    }

    for (const entity of ecs.entities) {
      ecs.removeComponent(entity, "b");
    }
  };
}

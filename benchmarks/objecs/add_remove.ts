import { World } from "@gamedev/objecs";

type Entity = {
  a?: boolean;
  b?: boolean;
};

export function addRemove(count: number) {
  const ecs = new World<Entity>();

  for (let i = 0; i < count; i++) {
    ecs.createEntity({
      a: true,
    });
  }

  return () => {
    for (const entity of ecs.entities) {
      ecs.addEntityComponents(entity, "b", true);
    }

    for (const entity of ecs.entities) {
      ecs.removeEntityComponents(entity, "b");
    }
  };
}

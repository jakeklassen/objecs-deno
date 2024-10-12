import { World } from "@gamedev/objecs";

type Entity = {
  z?: number;
  data?: number;
};

export function fragIter(count: number) {
  const ecs = new World<Entity>();

  Array.from("abcdefghijklmnopqrstuvwxyz").forEach((component) => {
    for (let i = 0; i < count; i++) {
      ecs.createEntity({ [component]: 1, data: 1 });
    }
  });

  const withZ = ecs.archetype("z");
  const withData = ecs.archetype("data");

  return () => {
    for (const entity of withZ.entities) {
      entity.z *= 2;
    }

    for (const entity of withData.entities) {
      entity.data *= 2;
    }
  };
}

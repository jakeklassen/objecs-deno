import { World } from "npm:miniplex";

type Entity = {
  z?: number;
  data?: number;
};

export function fragIter(count: number) {
  const ecs = new World<Entity>();

  Array.from("abcdefghijklmnopqrstuvwxyz").forEach((component) => {
    for (let i = 0; i < count; i++) {
      ecs.add({ [component]: 1, data: 1 });
    }
  });

  const withZ = ecs.with("z");
  const withData = ecs.with("data");

  return () => {
    for (const entity of withZ.entities) {
      entity.z *= 2;
    }

    for (const entity of withData.entities) {
      entity.data *= 2;
    }
  };
}

import { entityCycle as miniplexEntityCycle } from "./miniplex/entity_cycle.ts";
import { entityCycle as objecsEntityCycle } from "./objecs/entity_cycle.ts";

const ENTITY_CYCLE_COUNT = 1_000;

Deno.bench({
  name: "objecs",
  group: "entity_cycle",
  fn: objecsEntityCycle(ENTITY_CYCLE_COUNT),
});

Deno.bench({
  name: "miniplex",
  group: "entity_cycle",
  fn: miniplexEntityCycle(ENTITY_CYCLE_COUNT),
});

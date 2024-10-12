import { addRemove as miniplexAddRemove } from "./miniplex/add_remove.ts";
import { addRemove as objecsAddRemove } from "./objecs/add_remove.ts";

const ADD_REMOVE_COUNT = 1_000;

Deno.bench({
  name: "objecs",
  group: "add_remove",
  fn: objecsAddRemove(ADD_REMOVE_COUNT),
});

Deno.bench({
  name: "miniplex",
  group: "add_remove",
  fn: miniplexAddRemove(ADD_REMOVE_COUNT),
});

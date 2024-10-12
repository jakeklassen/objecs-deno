import { packed5 as miniplexPacked5 } from "./miniplex/packed_5.ts";
import { packed5 as objecsPacked5 } from "./objecs/packed_5.ts";

const PACKED_5_COUNT = 1_000;

Deno.bench({
  name: "objecs",
  group: "packed_5",
  fn: objecsPacked5(PACKED_5_COUNT),
});

Deno.bench({
  name: "miniplex",
  group: "packed_5",
  fn: miniplexPacked5(PACKED_5_COUNT),
});

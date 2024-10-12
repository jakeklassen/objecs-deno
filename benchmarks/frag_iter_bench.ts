import { fragIter as miniplexFragIter } from "./miniplex/frag_iter.ts";
import { fragIter as objecsFragIter } from "./objecs/frag_iter.ts";

const FRAG_ITER_COUNT = 100;

Deno.bench({
  name: "objecs",
  group: "frag_iter",
  fn: objecsFragIter(FRAG_ITER_COUNT),
});

Deno.bench({
  name: "miniplex",
  group: "frag_iter",
  fn: miniplexFragIter(FRAG_ITER_COUNT),
});

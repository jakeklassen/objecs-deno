import { simpleIter as miniplexSimpleIter } from "./miniplex/simple_iter.ts";
import { simpleIter as objecsSimpleIter } from "./objecs/simple_iter.ts";

const SIMPLE_ITER_COUNT = 1_000;

Deno.bench({
  name: "objecs",
  group: "simple_iter",
  fn: objecsSimpleIter(SIMPLE_ITER_COUNT),
});

Deno.bench({
  name: "miniplex",
  group: "simple_iter",
  fn: miniplexSimpleIter(SIMPLE_ITER_COUNT),
});

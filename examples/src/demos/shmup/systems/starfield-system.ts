import { rndInt } from "#/lib/math.ts";
import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

export function starfieldSystemFactory({ world }: { world: World<Entity> }) {
	const stars = world.archetype("star", "transform");

	return function starfieldSystem() {
		for (const { transform } of stars.entities) {
			// Just wrap the stars in y and reset their x position
			if (transform.position.y > 128) {
				transform.position.y = -1;
				transform.position.x = rndInt(127, 1);
			}
		}
	};
}

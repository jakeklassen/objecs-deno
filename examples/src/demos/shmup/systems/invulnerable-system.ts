import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

export function invulnerableSystemFactory({ world }: { world: World<Entity> }) {
	const invulnerables = world.archetype("invulnerable");

	return function invulnerableSystem(dt: number) {
		for (const entity of invulnerables.entities) {
			const { invulnerable } = entity;

			invulnerable.elapsedMs += dt * 1000;

			if (invulnerable.elapsedMs >= invulnerable.durationMs) {
				world.removeEntityComponents(entity, "invulnerable");
			}
		}
	};
}

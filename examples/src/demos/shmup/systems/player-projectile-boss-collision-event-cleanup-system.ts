import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

export function playerProjectileBossCollisionEventCleanupSystemFactory({
	world,
}: {
	world: World<Entity>;
}) {
	const events = world.archetype("eventPlayerProjectileBossCollision");

	return () => {
		for (const entity of events.entities) {
			world.deleteEntity(entity);
		}
	};
}

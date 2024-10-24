import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";
import { Timer } from "../timer.ts";

/**
 * This system handles the spinning ship enemy type.
 * When the enemy is in the attack state, if the player crosses it's path
 * along x, it will stop moving vertically and move towards the player.
 */
export function lateralHunterSystemFactory({
	world,
}: {
	timer: Timer;
	world: World<Entity>;
}) {
	const movables = world.archetype(
		"direction",
		"tagEnemy",
		"tagLateralHunter",
		"transform",
		"velocity",
	);

	const players = world.archetype("boxCollider", "tagPlayer", "transform");

	return function lateralHunterSystem() {
		const [player] = players.entities;

		if (player == null) {
			return;
		}

		for (const entity of movables.entities) {
			if (entity.enemyState !== "attack") {
				continue;
			}

			if (entity.transform.position.y > player.transform.position.y) {
				entity.direction.y = 0;
				entity.direction.x =
					entity.transform.position.x > player.transform.position.x ? -1 : 1;

				entity.velocity.x = 60;
				entity.velocity.y = 0;

				// No need to continue checking
				world.removeEntityComponents(entity, "tagLateralHunter");
			}
		}
	};
}

import { World } from "@gamedev/objecs";
import { fireSpread } from "../enemy/enemy-bullets.ts";
import { Entity } from "../entity.ts";

export function yellowShipSystemFactory({ world }: { world: World<Entity> }) {
	const yellowShips = world.archetype(
		"enemyState",
		"tagYellowShip",
		"transform",
		"velocity",
	);

	let spreadshotTimer = 0;

	return function yellowShipSystem(dt: number) {
		spreadshotTimer += dt;

		for (const yellowShip of yellowShips.entities) {
			if (yellowShip.enemyState === "attack") {
				if (yellowShip.transform.position.y > 110) {
					yellowShip.velocity.y = 30;
				} else {
					// When in attack mode, about every second, fire a spread of bullets
					if (spreadshotTimer > 1) {
						fireSpread({
							count: 8,
							enemy: yellowShip,
							speed: 40,
							world,
						});
					}
				}
			}
		}

		if (spreadshotTimer > 1) {
			spreadshotTimer = 0;
		}
	};
}

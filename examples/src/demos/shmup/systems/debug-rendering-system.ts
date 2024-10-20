import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

/**
 * System that renders box colliders for debugging.
 */
export function debugRenderingSystemFactory({
	world,
	context,
	config,
}: {
	world: World<Entity>;
	context: CanvasRenderingContext2D;
	config: Readonly<{ debug: boolean }>;
}) {
	const debuggables = world.archetype("boxCollider", "transform");

	return function debugRenderingSystem() {
		if (config.debug === false) {
			return;
		}

		for (const entity of debuggables.entities) {
			context.translate(
				entity.transform.position.x | 0,
				entity.transform.position.y | 0,
			);
			context.rotate(entity.transform.rotation);
			context.scale(entity.transform.scale.x, entity.transform.scale.y);

			context.globalAlpha = 0.3;

			context.fillStyle = "red";
			context.fillRect(
				entity.transform.scale.x > 0
					? entity.boxCollider.offsetX
					: -entity.boxCollider.offsetX - entity.boxCollider.width,
				entity.transform.scale.y > 0
					? entity.boxCollider.offsetY
					: -entity.boxCollider.offsetY - entity.boxCollider.height,
				entity.boxCollider.width,
				entity.boxCollider.height,
			);

			context.globalAlpha = 1;
			context.resetTransform();
		}
	};
}

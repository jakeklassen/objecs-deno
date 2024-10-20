import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

export function starfieldRenderingSystemFactory({
	world,
	context,
}: {
	world: World<Entity>;
	context: CanvasRenderingContext2D;
}) {
	const stars = world.archetype("star", "transform");

	return function starfieldRenderingSystem() {
		for (const { star, transform } of stars.entities) {
			context.globalAlpha = 1;

			context.translate(transform.position.x | 0, transform.position.y | 0);
			context.rotate(transform.rotation);
			context.scale(transform.scale.x, transform.scale.y);

			context.fillStyle = star.color;

			context.fillRect(0, 0, 1, 1);

			context.globalAlpha = 1;
			context.resetTransform();
		}
	};
}

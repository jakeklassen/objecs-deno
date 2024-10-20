import { World } from "@gamedev/objecs";
import { Entity } from "../entity.ts";

export function renderingSystemFactory(world: World<Entity>) {
	const renderables = world.archetype("sprite", "transform");

	return function renderingSystem(
		context: CanvasRenderingContext2D,
		spriteSheet: HTMLImageElement,
		_dt: number,
	) {
		const canvas = context.canvas;

		context.clearRect(0, 0, canvas.width, canvas.height);

		for (const { sprite, transform } of renderables.entities) {
			context.globalAlpha = sprite.opacity;

			context.translate(transform.position.x, transform.position.y);
			context.rotate(transform.rotation);
			context.scale(transform.scale.x, transform.scale.y);

			context.drawImage(
				spriteSheet,
				sprite.frame.sourceX,
				sprite.frame.sourceY,
				sprite.frame.width,
				sprite.frame.height,
				transform.scale.x > 0 ? 0 : -sprite.frame.width,
				transform.scale.y > 0 ? 0 : -sprite.frame.height,
				sprite.frame.width,
				sprite.frame.height,
			);

			context.globalAlpha = 1;
			context.resetTransform();
		}
	};
}

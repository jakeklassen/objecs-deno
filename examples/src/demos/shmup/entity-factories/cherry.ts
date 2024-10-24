import { World } from "@gamedev/objecs";
import { CollisionMasks } from "../bitmasks.ts";
import { spriteOutlineAnimationFactory } from "../components/sprite-outline-animation.ts";
import { spriteFactory } from "../components/sprite.ts";
import { transformFactory } from "../components/transform.ts";
import { Pico8Colors } from "../constants.ts";
import { Entity } from "../entity.ts";
import { SpriteSheet } from "../spritesheet.ts";

export function cherryFactory({
	transform,
	world,
}: {
	transform: NonNullable<Entity["transform"]>;
	world: World<Entity>;
}) {
	return world.createEntity({
		boxCollider: {
			offsetX: SpriteSheet.cherry.boxCollider.offsetX,
			offsetY: SpriteSheet.cherry.boxCollider.offsetY,
			width: SpriteSheet.cherry.boxCollider.width,
			height: SpriteSheet.cherry.boxCollider.height,
		},
		collisionLayer: CollisionMasks.Pickup,
		collisionMask: CollisionMasks.Player,
		direction: {
			x: 0,
			y: 1,
		},
		tagPickup: true,
		transform: transformFactory({
			position: transform.position,
		}),
		sprite: spriteFactory({
			frame: {
				sourceX: SpriteSheet.cherry.frame.sourceX,
				sourceY: SpriteSheet.cherry.frame.sourceY,
				width: SpriteSheet.cherry.frame.width,
				height: SpriteSheet.cherry.frame.height,
			},
		}),
		spriteOutline: {
			color: Pico8Colors.Color7,
		},
		spriteOutlineAnimation: spriteOutlineAnimationFactory({
			colors: [Pico8Colors.Color7, Pico8Colors.Color14],
			colorSequence: [0, 1],
			durationMs: 100,
		}),
		velocity: {
			x: 0,
			y: 30,
		},
	});
}

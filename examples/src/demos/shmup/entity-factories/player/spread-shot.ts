import { deg2rad } from "#/lib/math.ts";
import { Easing } from "#/lib/tween.ts";
import { World } from "@gamedev/objecs";
import { SetRequired } from "type-fest";
import { CollisionMasks } from "../../bitmasks.ts";
import { spriteFactory } from "../../components/sprite.ts";
import { transformFactory } from "../../components/transform.ts";
import { tweenFactory } from "../../components/tween.ts";
import { Pico8Colors } from "../../constants.ts";
import { Entity } from "../../entity.ts";
import { SpriteSheet } from "../../spritesheet.ts";

export function spreadShot({
	count,
	player,
	playerThruster,
	speed,
	world,
}: {
	count: number;
	player: SetRequired<Entity, "tagPlayer" | "transform">;
	playerThruster: SetRequired<Entity, "tagPlayerThruster">;
	speed: number;
	world: World<Entity>;
}) {
	// Spawn two muzzle flashes for a slightly better centered look
	world.createEntity({
		muzzleFlash: {
			color: "white",
			durationMs: 0.1,
			elapsed: 0,
			initialSize: 5,
			size: 5,
		},
		transform: {
			position: {
				x: player.transform.position.x,
				y: player.transform.position.y,
			},
			rotation: 0,
			scale: {
				x: 1,
				y: 1,
			},
		},
		trackPlayer: {
			offset: {
				x: 3,
				y: -2,
			},
		},
	});

	world.createEntity({
		muzzleFlash: {
			color: "white",
			durationMs: 0.1,
			elapsed: 0,
			initialSize: 5,
			size: 5,
		},
		transform: {
			position: {
				x: player.transform.position.x,
				y: player.transform.position.y,
			},
			rotation: 0,
			scale: {
				x: 1,
				y: 1,
			},
		},
		trackPlayer: {
			offset: {
				x: 4,
				y: -2,
			},
		},
	});

	// Shockwave
	world.createEntity({
		shockwave: {
			radius: 3,
			targetRadius: 25,
			color: Pico8Colors.Color7,
			speed: 105,
		},
		transform: transformFactory({
			position: {
				x: player.transform.position.x + 3,
				y: player.transform.position.y + 3,
			},
		}),
	});

	// Initial flash of the explosion
	world.createEntity({
		particle: {
			age: 0,
			maxAge: 0,
			color: Pico8Colors.Color7,
			radius: 10,
			shape: "circle",
		},
		transform: transformFactory({
			position: {
				x: player.transform.position.x + 3,
				y: player.transform.position.y + 3,
			},
		}),
		velocity: {
			x: 0,
			y: 0,
		},
	});

	// Flash player sprite
	world.addEntityComponents(player, "flash", {
		alpha: 1,
		color: Pico8Colors.Color7,
		durationMs: 100,
		elapsedMs: 0,
	});

	// Flash thruster sprite
	world.addEntityComponents(playerThruster, "flash", {
		alpha: 1,
		color: Pico8Colors.Color7,
		durationMs: 100,
		elapsedMs: 0,
	});

	// Invulnerability
	world.addEntityComponents(player, "invulnerable", {
		durationMs: 1000,
		elapsedMs: 0,
	});

	world.addEntityComponents(player, "tweens", [
		...(player.tweens ?? []),
		tweenFactory("sprite.opacity", {
			duration: 100,
			easing: Easing.Linear,
			from: 1,
			to: 0,
			maxIterations: 10,
			yoyo: true,
		}),
	]);

	world.addEntityComponents(playerThruster, "tweens", [
		...(playerThruster.tweens ?? []),
		tweenFactory("sprite.opacity", {
			duration: 100,
			easing: Easing.Linear,
			from: 1,
			to: 0,
			maxIterations: 10,
			yoyo: true,
		}),
	]);

	const total = count * 2;

	for (let i = 0; i < total + 1; ++i) {
		// From 225 to 135 degrees, evenly space the bullets
		// 180 degrees is straight up
		const angle = 225 - (i * 90) / total;

		const velocity = {
			x: Math.sin(deg2rad(angle)) * speed,
			y: Math.cos(deg2rad(angle)) * speed,
		};

		const direction = {
			x: Math.sign(velocity.x),
			y: Math.sign(velocity.y),
		};

		velocity.x = Math.abs(velocity.x);
		velocity.y = Math.abs(velocity.y);

		const transform = transformFactory({
			position: {
				x: player.transform.position.x ?? 0 + 3,
				y: player.transform.position.y ?? 0 + 6,
			},
		});

		world.createEntity({
			boxCollider: {
				offsetX: SpriteSheet.bigBullet.boxCollider.offsetX,
				offsetY: SpriteSheet.bigBullet.boxCollider.offsetY,
				width: SpriteSheet.bigBullet.boxCollider.width,
				height: SpriteSheet.bigBullet.boxCollider.height,
			},
			collisionLayer: CollisionMasks.PlayerProjectile,
			collisionMask: CollisionMasks.Enemy,
			direction,
			sprite: spriteFactory({
				frame: {
					sourceX: SpriteSheet.bigBullet.frame.sourceX,
					sourceY: SpriteSheet.bigBullet.frame.sourceY,
					width: SpriteSheet.bigBullet.frame.width,
					height: SpriteSheet.bigBullet.frame.height,
				},
			}),
			tagBigBullet: true,
			transform,
			velocity,
		});
	}
}

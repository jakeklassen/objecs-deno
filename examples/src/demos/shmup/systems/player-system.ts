import { World } from "@gamedev/objecs";
import { CollisionMasks } from "../bitmasks.ts";
import { spriteFactory } from "../components/sprite.ts";
import { spreadShot } from "../entity-factories/player/spread-shot.ts";
import { Entity } from "../entity.ts";
import { GameState } from "../game-state.ts";
import { Input } from "../input.ts";
import { SpriteSheet } from "../spritesheet.ts";

export function playerSystemFactory({
	input,
	gameState,
	spritesheet,
	world,
}: {
	input: Input;
	gameState: GameState;
	spritesheet: SpriteSheet;
	world: World<Entity>;
}) {
	const players = world.archetype(
		"boxCollider",
		"direction",
		"sprite",
		"tagPlayer",
		"transform",
		"velocity",
	);

	const playerThrusters = world.archetype("tagPlayerThruster");

	const initialBulletTime = 1;
	let bulletTimer = 0;
	const bulletCooldown = 7;
	let cherryBombFired = false;

	return (dt: number) => {
		bulletTimer -= bulletCooldown * dt;
		cherryBombFired = false;

		const [player] = players.entities;
		const [playerThruster] = playerThrusters.entities;

		if (player == null || playerThruster == null) {
			return;
		}

		// Start each frame with the idle sprite
		player.sprite.frame = {
			sourceX: spritesheet.player.idle.sourceX,
			sourceY: spritesheet.player.idle.sourceY,
			width: spritesheet.player.idle.width,
			height: spritesheet.player.idle.height,
		};

		player.direction.x = 0;
		player.direction.y = 0;

		if (input.left.query()) {
			player.direction.x = -1;
			player.sprite.frame = {
				sourceX: spritesheet.player.bankLeft.sourceX,
				sourceY: spritesheet.player.bankLeft.sourceY,
				width: spritesheet.player.bankLeft.width,
				height: spritesheet.player.bankLeft.height,
			};
		} else if (input.right.query()) {
			player.direction.x = 1;
			player.sprite.frame = {
				sourceX: spritesheet.player.bankRight.sourceX,
				sourceY: spritesheet.player.bankRight.sourceY,
				width: spritesheet.player.bankRight.width,
				height: spritesheet.player.bankRight.height,
			};
		}

		if (input.up.query()) {
			player.direction.y = -1;
		} else if (input.down.query()) {
			player.direction.y = 1;
		}

		if (input.confirm.query()) {
			if (gameState.cherries > 0) {
				spreadShot({
					count: gameState.cherries,
					player,
					playerThruster,
					speed: 120,
					world,
				});

				if (player.invulnerable != null) {
					const timeLeft = player.invulnerable.durationMs -
						player.invulnerable.elapsedMs;

					// Extend invulnerability
					if (timeLeft < 1000) {
						player.invulnerable.durationMs = 1000;
						player.invulnerable.elapsedMs = 0;
					}
				} else {
					world.addEntityComponents(player, "invulnerable", {
						durationMs: 1000,
						elapsedMs: 0,
					});
				}

				world.createEntity({
					eventTriggerCameraShake: {
						durationMs: 200,
						strength: 3,
					},
				});

				world.createEntity({
					eventPlaySound: {
						track: "spread-shot",
						options: {
							loop: false,
						},
					},
				});

				cherryBombFired = true;
				gameState.cherries = 0;
			} else {
				world.createEntity({
					eventPlaySound: {
						track: "no-spread-shot",
						options: {
							loop: false,
						},
					},
				});
			}
		}

		if (input.bomb.query() && !gameState.bombLocked) {
			world.createEntity({
				eventTriggerBomb: true,
			});
		}

		if (input.fire.query() && !cherryBombFired) {
			if (bulletTimer <= 0) {
				bulletTimer = initialBulletTime;

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

				// Spawn a bullet
				world.createEntity({
					boxCollider: spritesheet.bullet.boxCollider,
					collisionLayer: CollisionMasks.PlayerProjectile,
					collisionMask: CollisionMasks.Enemy,
					destroyOnViewportExit: true,
					direction: {
						x: 0,
						y: -1,
					},
					tagBullet: true,
					transform: {
						position: {
							x: player.transform.position.x +
								spritesheet.bullet.frame.width / 4,
							y: player.transform.position.y - spritesheet.bullet.frame.height,
						},
						rotation: 0,
						scale: {
							x: 1,
							y: 1,
						},
					},
					sprite: spriteFactory({
						frame: {
							sourceX: spritesheet.bullet.frame.sourceX,
							sourceY: spritesheet.bullet.frame.sourceY,
							width: spritesheet.bullet.frame.width,
							height: spritesheet.bullet.frame.height,
						},
					}),
					velocity: {
						x: 0,
						y: 120,
					},
				});

				world.createEntity({
					eventPlaySound: {
						track: "shoot",
						options: {
							loop: false,
						},
					},
				});
			}
		}
	};
}

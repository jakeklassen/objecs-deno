import { rndInt } from "#/lib/math.ts";
import { World } from "@gamedev/objecs";
import { spriteAnimationFactory } from "../components/sprite-animation.ts";
import { spriteFactory } from "../components/sprite.ts";
import { textBlinkAnimationFactory } from "../components/text-blink-animation.ts";
import { transformFactory } from "../components/transform.ts";
import { ttlFactory } from "../components/ttl.ts";
import { Config } from "../config.ts";
import { Pico8Colors, SpriteLayer } from "../constants.ts";
import { LoadedContent } from "../content.ts";
import { cherryFactory } from "../entity-factories/cherry.ts";
import { destroyPlayerBulletFactory } from "../entity-factories/destroy-player-bullet.ts";
import { Entity } from "../entity.ts";
import { assertEnityHasOrThrow } from "../entity/assert.ts";
import { GameState } from "../game-state.ts";
import { animationDetailsFactory } from "../structures/animation-details.ts";

export function playerProjectileEnemyCollisionEventSystemFactory({
	config,
	content,
	gameState,
	world,
}: {
	config: Config;
	content: LoadedContent;
	gameState: GameState;
	world: World<Entity>;
}) {
	const events = world.archetype("eventPlayerProjectileEnemyCollision");

	return function playerProjectileEnemyCollisionEventSystem() {
		for (const entity of events.entities) {
			const { eventPlayerProjectileEnemyCollision: event } = entity;

			destroyPlayerBulletFactory({
				bullet: event.projectile,
				shockwave: event.projectile.tagBullet
					? {
						location: {
							x: (event.projectile.transform?.position.x ?? 0) +
								(event.projectile.sprite?.frame.width ?? 0) / 2,
							y: (event.projectile.transform?.position.y ?? 0) +
								(event.projectile.sprite?.frame.height ?? 0) / 2,
						},
					}
					: undefined,
				world,
			});

			if (event.enemy.invulnerable == null && event.enemy.health != null) {
				event.enemy.health -= event.damage;

				world.addEntityComponents(event.enemy, "flash", {
					alpha: 1,
					color: Pico8Colors.Color7,
					durationMs: 100,
					elapsedMs: 0,
				});

				// Enemy is dead
				if (event.enemy.health <= 0) {
					assertEnityHasOrThrow(event.enemy, "enemyType");

					const enemyConfig = config.entities.enemies[event.enemy.enemyType];

					let cherryChance = 0.1;
					let scoreMultiplier = 1;

					if (event.enemy.enemyState === "attack") {
						scoreMultiplier = 2;
						cherryChance = 0.2;

						const score = enemyConfig.score * scoreMultiplier;

						// Show bonus score text
						world.createEntity({
							direction: {
								x: 0,
								y: -1,
							},
							text: {
								align: "center",
								color: Pico8Colors.Color7,
								font: "PICO-8",
								message: `${score}`,
							},
							textBlinkAnimation: textBlinkAnimationFactory({
								colors: [Pico8Colors.Color7, Pico8Colors.Color8],
								colorSequence: [0, 1],
								durationMs: 100,
							}),
							transform: transformFactory({
								position: {
									x: event.enemy.transform.position.x + 4,
									y: event.enemy.transform.position.y + 4,
								},
							}),
							ttl: ttlFactory({ durationMs: 2000 }),
							velocity: {
								x: 0,
								y: 15,
							},
						});

						if (Math.random() < 0.5) {
							world.createEntity({
								eventTriggerEnemyAttack: true,
							});
						}
					}

					if (Math.random() < cherryChance) {
						cherryFactory({
							transform: event.enemy.transform,
							world,
						});
					}

					const explosionIndex = rndInt(content.explosions.height / 64);
					const sourceY = explosionIndex * 64;

					world.createEntity({
						sprite: spriteFactory({
							frame: {
								sourceX: 0,
								sourceY,
								width: 64,
								height: 64,
							},
							layer: SpriteLayer.Explosion,
						}),
						spriteAnimation: spriteAnimationFactory(
							animationDetailsFactory(
								`explosion`,
								0,
								sourceY,
								content.explosions.width,
								64,
								64,
								64,
							),
							100,
							false,
						),
						spritesheet: "explosions",
						transform: transformFactory({
							position: {
								x: (event.projectile.transform?.position.x ?? 0) +
									(event.projectile.sprite?.frame.width ?? 0) / 2 -
									32,
								y: (event.projectile.transform?.position.y ?? 0) +
									(event.projectile.sprite?.frame.height ?? 0) / 2 -
									32,
							},
						}),
					});

					world.deleteEntity(event.enemy);

					world.createEntity({
						eventPlaySound: {
							track: "enemy-death",
							options: {
								loop: false,
							},
						},
					});

					gameState.score += enemyConfig.score * scoreMultiplier;
				}
			}
		}
	};
}

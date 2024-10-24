import { World } from "@gamedev/objecs";
import { textBlinkAnimationFactory } from "../components/text-blink-animation.ts";
import { transformFactory } from "../components/transform.ts";
import { ttlFactory } from "../components/ttl.ts";
import { Config } from "../config.ts";
import { Pico8Colors } from "../constants.ts";
import { spawnWave } from "../entity-factories/wave.ts";
import { Entity } from "../entity.ts";
import { GameState } from "../game-state.ts";
import { Timer, TimeSpan } from "../timer.ts";

export function nextWaveEventSystemFactory({
	canvas,
	config,
	gameState,
	timer,
	world,
}: {
	canvas: HTMLCanvasElement;
	config: Config;
	gameState: GameState;
	timer: Timer;
	world: World<Entity>;
}) {
	const nextWaveEvents = world.archetype("eventNextWave");
	const maxMaves = Object.keys(config.waves).length;

	return function nextWaveEventSystem(dt: number) {
		if (nextWaveEvents.entities.size === 0) {
			return;
		}

		const [entity] = nextWaveEvents.entities;

		gameState.waveReady = false;
		gameState.wave++;

		const wave = config.waves[gameState.wave];

		if (wave == null) {
			return;
		}

		const text: NonNullable<Entity["text"]> = {
			align: "center",
			color: Pico8Colors.Color6,
			font: "PICO-8",
			message: "",
		};

		if (gameState.wave < maxMaves) {
			text.message = `Wave ${gameState.wave} of ${maxMaves}`;
		} else if (gameState.wave === maxMaves) {
			text.message = "Final Wave!";
		}

		const waveTextTTL = 2600;

		// Show next wave text
		world.createEntity({
			text,
			textBlinkAnimation: textBlinkAnimationFactory({
				colors: [Pico8Colors.Color5, Pico8Colors.Color6, Pico8Colors.Color7],
				colorSequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0],
				durationMs: 500,
			}),
			transform: transformFactory({
				position: {
					x: canvas.width / 2,
					y: 40,
				},
			}),
			ttl: ttlFactory({
				durationMs: waveTextTTL,
			}),
		});

		// TODO: Don't play sound before final wave?
		if (gameState.wave > 1) {
			world.createEntity({
				eventPlaySound: {
					track: "wave-complete",
					options: { loop: false },
				},
			});
		}

		// Synchronize wave spawn with text destroy
		timer.add(new TimeSpan(waveTextTTL), () => {
			spawnWave({
				dt,
				timer,
				wave,
				world,
			});

			if (gameState.wave === gameState.maxWaves) {
				timer.add(new TimeSpan(500), () => {
					world.createEntity({
						eventPlaySound: {
							track: "boss-music",
							options: { loop: true },
						},
					});
				});
			} else {
				world.createEntity({
					eventPlaySound: {
						track: "wave-spawn",
						options: { loop: false },
					},
				});
			}
		});

		world.deleteEntity(entity);
	};
}

import gabeRunImageUrl from "#/assets/image/gabe-idle-run.png";
import { loadImage } from "#/lib/asset-loader";
import { obtainCanvasAndContext2d } from "#/lib/dom";
import { World } from "@gamedev/objecs";
import { Pane } from "tweakpane";
import "../../style.css";
import { boxColliderFactory } from "./components/box-collider.ts";
import { spriteFactory } from "./components/sprite.ts";
import { spriteAnimationFactory } from "./components/sprite-animation.ts";
import { Entity } from "./entity.ts";
import { SpriteSheet } from "./spritesheet.ts";
import { animationDetailsFactory } from "./structures/animation-details.ts";
import { debugRenderingSystemFactory } from "./systems/debug-rendering-system.ts";
import { movementSystemFactory } from "./systems/movement-system.ts";
import { playerSystemFactory } from "./systems/player-system.ts";
import { renderingSystemFactory } from "./systems/rendering-system.ts";
import { spriteAnimationSystemFactory } from "./systems/sprite-animation-system.ts";

const gabeImage = await loadImage(gabeRunImageUrl);

const { canvas, context } = obtainCanvasAndContext2d("#canvas");

context.imageSmoothingEnabled = false;

const config = {
	debug: false,
};

const PARAMS = {
	debug: false,
};

const pane = new Pane();
const debugInput = pane.addBinding(PARAMS, "debug");

debugInput.on("change", (event) => {
	config.debug = event.value;
});

const world = new World<Entity>();

world.createEntity({
	boxCollider: boxColliderFactory(4, 2, 16, 22),
	direction: { x: 1, y: 0 },
	playerTag: true,
	transform: {
		position: { x: 32, y: 54 },
		rotation: 0,
		scale: { x: 1, y: 1 },
	},
	sprite: spriteFactory({
		sourceX: SpriteSheet.gabe.animations.run.sourceX,
		sourceY: SpriteSheet.gabe.animations.run.sourceY,
		width: SpriteSheet.gabe.animations.run.frameWidth,
		height: SpriteSheet.gabe.animations.run.frameHeight,
	}),
	spriteAnimation: spriteAnimationFactory(
		animationDetailsFactory(
			"gabe-run",
			SpriteSheet.gabe.animations.run.sourceX,
			SpriteSheet.gabe.animations.run.sourceY,
			SpriteSheet.gabe.animations.run.width,
			SpriteSheet.gabe.animations.run.height,
			SpriteSheet.gabe.animations.run.frameWidth,
			SpriteSheet.gabe.animations.run.frameHeight,
		),
		1000,
	),
	velocity: { x: 50, y: 0 },
});

const spriteAnimationSystem = spriteAnimationSystemFactory(world);
const movementSystem = movementSystemFactory(world);
const playerSystem = playerSystemFactory(world, {
	width: canvas.width,
	height: canvas.height,
});
const renderingSystem = renderingSystemFactory(world, context, gabeImage);
const debugRenderingSystem = debugRenderingSystemFactory(
	world,
	context,
	config,
);

let last = performance.now();

/**
 * The game loop.
 */
const frame = (hrt: DOMHighResTimeStamp) => {
	const dt = Math.min(1000, hrt - last) / 1000;

	spriteAnimationSystem(dt);
	movementSystem(dt);
	playerSystem(dt);
	renderingSystem(dt);
	debugRenderingSystem(dt);

	last = hrt;

	requestAnimationFrame(frame);
};

// Start the game loop.
requestAnimationFrame(frame);

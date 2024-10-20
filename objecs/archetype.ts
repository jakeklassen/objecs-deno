import type { JsonObject } from "type-fest";
import type { World } from "./world.ts";

type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

/**
 * An archetype is a collection of entities that share the same components.
 * Archetypes should not be constructed directly, but rather through the
 * {@link World} class using the {@link World#archetype} method.
 */
export class Archetype<
  Entity extends JsonObject,
  Components extends Array<keyof Entity>,
> {
  #entities: Set<SafeEntity<Entity, Components[number]>> = new Set();
  #components: Components;
  #excluding?: Array<Exclude<keyof Entity, Components[number]>>;
  #world: World<Entity>;

  constructor({
    entities,
    world,
    components,
    without,
  }: {
    world: World<Entity>;
    entities: Set<Entity>;
    components: Components;
    without?: Array<Exclude<keyof Entity, Components[number]>>;
  }) {
    this.#world = world;
    this.#entities = entities as Set<SafeEntity<Entity, Components[number]>>;
    this.#components = components;
    this.#excluding = without;

    world.archetypes.add(this as any);
  }

  public get entities(): ReadonlySet<SafeEntity<Entity, Components[number]>> {
    return this.#entities;
  }

  public get components(): Readonly<Components> {
    return this.#components;
  }

  public get excluding(): Readonly<
    Array<Exclude<keyof Entity, Components[number]>>
  > {
    return this.#excluding ?? [];
  }

  /**
   * Verify if the entity matches the archetype components criteria.
   */
  public matches(entity: Entity): boolean {
    const matchesArchetype = this.#components.every((component) => {
      return component in entity;
    });

    const matchesExcluding = this.#excluding?.some((component) => {
      return component in entity;
    }) ?? false;

    return matchesArchetype && !matchesExcluding;
  }

  public addEntity(entity: Entity): Archetype<Entity, Components> {
    if (this.#entities.has(entity as any)) {
      return this;
    }

    if (this.matches(entity)) {
      this.#entities.add(entity as any);
    }

    return this;
  }

  public removeEntity(entity: Entity): Archetype<Entity, Components> {
    this.#entities.delete(entity as any);

    return this;
  }

  clearEntities() {
    this.#entities.clear();
  }

  /**
   * Returns a new archetype based on the current archetype, but excludes the
   * specified components.
   * @param components Components that should **not** be present on the entity
   */
  without<Component extends keyof Entity>(
    ...components: Component[]
  ): Archetype<
    SafeEntity<
      Omit<Entity, (typeof components)[number]>,
      Exclude<Components[number], (typeof components)[number]>
    >,
    Array<Exclude<Components[number], (typeof components)[number]>>
  > {
    const entities = new Set<
      SafeEntity<
        Omit<Entity, (typeof components)[number]>,
        Exclude<Components[number], (typeof components)[number]>
      >
    >();

    for (const entity of this.#entities) {
      const matchesWithout = components.every((component) => {
        return component in entity;
      });

      if (matchesWithout) {
        continue;
      }

      entities.add(entity as any);
    }

    const archetype = new Archetype<
      SafeEntity<
        Omit<Entity, (typeof components)[number]>,
        Exclude<Components[number], (typeof components)[number]>
      >,
      Array<Exclude<Components[number], (typeof components)[number]>>
    >({
      entities,
      world: this.#world as any,
      components: this.#components as any,
      without: components as any,
    });

    return archetype;
  }
}

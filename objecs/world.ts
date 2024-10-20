import type { JsonObject } from "type-fest";
import { Archetype } from "./archetype.ts";

export type SafeEntity<
  Entity extends JsonObject,
  Components extends keyof Entity,
> = Entity & Required<Pick<Entity, Components>>;

/**
 * Container for entity and archetype management.
 *
 * @example
 * ```ts
 * type Entity = {
 *   position: { x: number; y: number };
 *   velocity: { x: number; y: number };
 * };
 *
 * const world = new World<Entity>();
 *
 * const entity = world.createEntity({
 *   position: { x: 0, y: 0 },
 *   velocity: { x: 0, y: 0 },
 * });
 * ```
 */
export class World<Entity extends JsonObject> {
  #archetypes = new Set<Archetype<Entity, Array<keyof Entity>>>();
  #entities = new Set<Entity>();

  public get archetypes(): Set<Archetype<Entity, Array<keyof Entity>>> {
    return this.#archetypes;
  }

  public get entities(): ReadonlySet<Entity> {
    return this.#entities;
  }

  /**
   * Removes all entities from the world and all archetypes.
   */
  public clearEntities() {
    this.#entities.clear();

    for (const archetype of this.#archetypes) {
      archetype.clearEntities();
    }
  }

  /**
   * Returns a new archetype that will guarantee that all entities within it
   * will have the given components.
   *
   * @example
   * ```ts
   * type Entity = {
   *   position: { x: number; y: number };
   *   velocity: { x: number; y: number };
   * };
   *
   * const world = new World<Entity>();
   *
   * const movables = world.archetype("position", "velocity");
   *
   * // Movement system
   * for (const entity of movables.entities) {
   *   entity.position.x += entity.velocity.x * Game.deltaTime;
   *   entity.position.y += entity.velocity.y * Game.deltaTime;
   * }
   * ```
   */
  public archetype<Components extends Array<keyof Entity>>(
    ...components: Components
  ): Archetype<
    SafeEntity<Entity, (typeof components)[number]>,
    typeof components
  > {
    const entities = new Set<Entity>();

    for (const entity of this.#entities) {
      const matchesArchetype = components.every((component) => {
        return component in entity;
      });

      if (matchesArchetype === true) {
        entities.add(entity);
      }
    }

    const archetype = new Archetype({
      entities,
      world: this,
      components,
    });

    return archetype as Archetype<
      SafeEntity<Entity, (typeof components)[number]>,
      typeof components
    >;
  }

  public createEntity(): Entity;
  /**
   * Create an entity with the given components. This is a type-safe version
   * __but__ it is of a point in time. When the entity is created. So don't
   * rely on it to be type-safe in the future when used within systems.
   */
  public createEntity<T extends Entity>(
    entity: T,
  ): keyof typeof entity extends never ? never
    : Pick<Entity & T, keyof typeof entity>;
  public createEntity<T extends Entity>(entity?: T) {
    const _entity = entity ?? ({} as T);

    this.#entities.add(_entity);

    for (const archetype of this.#archetypes) {
      archetype.addEntity(_entity);
    }

    return _entity as SafeEntity<Entity, keyof typeof entity>;
  }

  public deleteEntity(entity: Entity): boolean {
    for (const archetype of this.#archetypes) {
      archetype.removeEntity(entity);
    }

    return this.#entities.delete(entity);
  }

  public addEntityComponents<T extends Entity, Component extends keyof Entity>(
    entity: T,
    component: Component,
    value: NonNullable<Entity[Component]>,
  ): T & Record<typeof component, typeof value> {
    const existingEntity = this.#entities.has(entity);

    if (existingEntity === false) {
      throw new Error(`Entity ${entity} does not exist`);
    }

    // This will update the key and value in the map
    // @ts-ignore - This is fine
    entity[component] = value;

    for (const archetype of this.#archetypes) {
      if (archetype.matches(entity)) {
        archetype.addEntity(entity);
      } else {
        archetype.removeEntity(entity);
      }
    }

    return entity as T & Record<typeof component, typeof value>;
  }

  public removeEntityComponents<
    T extends Entity,
    Component extends keyof Entity,
  >(entity: T, ...components: Array<Component>): void {
    if (this.#entities.has(entity)) {
      for (const component of components) {
        delete entity[component];
      }

      for (const archetype of this.#archetypes) {
        if (archetype.matches(entity)) {
          archetype.addEntity(entity);
        } else {
          archetype.removeEntity(entity);
        }
      }
    }
  }
}

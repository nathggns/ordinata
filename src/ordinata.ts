import lodashPick from "lodash/pick";

export function pick<T>() {
    return <K extends keyof T>(keys: K[]) => {
        let oldEntities: T[];
        let oldState: Pick<T, K>[];

        const shouldUpdate = (entities: T[]): boolean => {
            if (
                !(
                    oldEntities !== entities &&
                    oldState &&
                    oldEntities &&
                    oldEntities.length === entities.length
                )
            ) {
                return true;
            }

            for (let idx = 0; idx < entities.length; idx++) {
                for (const key of keys) {
                    if (entities[idx][key] !== oldEntities[idx][key]) {
                        return true;
                    }
                }
            }

            return false;
        };

        return (entities: T[]) => {
            if (!shouldUpdate(entities)) {
                return oldState;
            }

            const newState = entities.map<Pick<T, K>>(entity =>
                // @todo this as should not be necessary
                lodashPick(entity, keys) as Pick<T, K>
            );

            oldEntities = entities;
            oldState = newState;

            return newState;
        };
    };
}

export function pickOne<T>() {
    return <K extends keyof T>(key: K) => {
        let oldEntities: T[];
        let oldState: T[K][];

        const shouldUpdate = (entities: T[]): boolean => {
            if (
                !(
                    oldEntities !== entities &&
                    oldState &&
                    oldEntities &&
                    oldEntities.length === entities.length
                )
            ) {
                return true;
            }

            for (let idx = 0; idx < entities.length; idx++) {
                if (entities[idx][key] !== oldEntities[idx][key]) {
                    return true;
                }
            }

            return false;
        };

        return (entities: T[]) => {
            if (!shouldUpdate(entities)) {
                return oldState;
            }

            const newState = entities.map<T[K]>(entity =>
                entity[key]
            );

            oldEntities = entities;
            oldState = newState;

            return newState;
        };
    };
}

export function filter<T>(): <TT extends T>(shouldInclude: (entity: T) => boolean) => (entities: T[]) => TT[] {
    return function<TT extends T>(shouldInclude: (entity: T) => boolean) {
        let oldEntities: T[];
        let filteredIndexes: number[];
        let oldState: TT[];

        const shouldUpdate = (entities: T[]): boolean => {
            if (
                !(
                    oldEntities !== entities &&
                    oldState &&
                    oldEntities &&
                    filteredIndexes &&
                    oldEntities.length === entities.length
                )
            ) {
                return true;
            }

            for (const idx of filteredIndexes) {
                if (entities[idx] !== oldEntities[idx]) {
                    return true;
                }
            }

            return false;
        };

        return (entities: T[]) => {
            if (!shouldUpdate(entities)) {
                return oldState;
            }

            const [indexes, newState] = entities.reduce(
                (acc, entity, idx) => {
                    if (shouldInclude(entity)) {
                        acc[0].push(idx);
                        // @todo should ensure TT is assignable to T in someway
                        acc[1].push(entity as any as TT);
                    }

                    return acc;
                },
                [[] as number[], [] as TT[]]
            );

            oldEntities = entities;
            filteredIndexes = indexes;
            oldState = newState;

            return newState;
        };
    }
}

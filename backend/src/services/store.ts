
export class InMemoryStore<T extends { _id?: string | any }> {
    private data: Map<string, T>;
    private name: string;

    constructor(name: string) {
        this.data = new Map();
        this.name = name;
        console.log(`[InMemoryStore] Initialized for ${name}`);
    }

    async findOne(query: any): Promise<T | null> {
        // Simple linear scan for MVP
        for (const item of this.data.values()) {
            let match = true;
            for (const key in query) {
                if ((item as any)[key] !== query[key]) {
                    match = false;
                    break;
                }
            }
            if (match) return item;
        }
        return null;
    }

    async find(query: any): Promise<T[]> {
        const results: T[] = [];
        for (const item of this.data.values()) {
            let match = true;
            for (const key in query) {
                if ((item as any)[key] !== query[key]) {
                    match = false;
                    break;
                }
            }
            if (match) results.push(item);
        }
        return results;
    }

    async findOneAndUpdate(query: any, update: any, options: { upsert?: boolean, new?: boolean } = {}): Promise<T | null> {
        let item = await this.findOne(query);

        if (!item && options.upsert) {
            // Create new
            item = { ...query, ...update.value, _id: crypto.randomUUID() } as T;
            // Handle specific update operators if needed (like $set), but for now assuming simple replace/merge
            if (update.$set) Object.assign(item as any, update.$set);
            // Handle simple value replacement (like in cache)
            if (update.value) (item as any).value = update.value;
            if (update.expiresAt) (item as any).expiresAt = update.expiresAt;

            this.data.set(item._id, item);
            return item;
        }

        if (item) {
            if (update.$set) Object.assign(item as any, update.$set);
            // Cache specific updates
            if (update.value) (item as any).value = update.value;
            if (update.expiresAt) (item as any).expiresAt = update.expiresAt;

            this.data.set(item._id, item);
            return item;
        }

        return null;
    }

    async deleteOne(query: any): Promise<{ deletedCount: number }> {
        const item = await this.findOne(query);
        if (item && item._id) {
            this.data.delete(item._id);
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    }

    // Mongoose-like .save() wrapper
    createModel(data: T) {
        const self = this;
        return {
            ...data,
            _id: crypto.randomUUID(),
            save: async function () {
                self.data.set(this._id, this as any);
                return this;
            }
        };
    }
}

// Instantiate Global Stores
export const UserStore = new InMemoryStore('User');
export const TripStore = new InMemoryStore('Trip');
export const CacheStore = new InMemoryStore('Cache');

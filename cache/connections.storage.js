'use strict';

class ConnectionsStorage {
	constructor() {
		this.storage = {};
	}

	get(date, uuid, key) {
		const currentStorage = this.storage[date];
		let storage;

		if (currentStorage && currentStorage[uuid]) {
			storage = currentStorage[uuid][key];
		}

		return storage;
	}

	cache(date, uuid, key, data) {
		this.storage[date] = this.storage[date] || {};
		this.storage[date][uuid] = this.storage[date][uuid] || {};

		if (
			!this.storage[date][uuid][key] ||
			this.storage[date][uuid][key] !== data
		) {
			this.storage[date][uuid][key] = data;
		}
	}
}

module.exports = new ConnectionsStorage();

export class Discussion {
	id: number;

	constructor(id: number) {
		this.id = id;
	}

	get url() {
		return `/discussion/${this.id}`;
	}
}

export class User {
	username: string;

	constructor(username: string) {
		this.username = username;
	}

	get url() {
		return `/profile/${this.username}`;
	}
}

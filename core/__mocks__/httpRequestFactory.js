export class XMLHttpRequestFactory {
	constructor() {
		this.shouldFail = false;
		this.readyState = 4;
	}

	onreadystatechange() {}
	open(httpVerb, url) {
		if (url === '/path/to/success') {
			this.shouldFail = false;
		}

		if (url === '/path/to/error') {
			this.shouldFail = true;
		}

		if (url === '/path/to/not/ready') {
			this.shouldFail = false;
			this.readyState = 0;
		}
	}
	send() {
		if (this.shouldFail === false) {
			this.onreadystatechange();
		}
	}
}

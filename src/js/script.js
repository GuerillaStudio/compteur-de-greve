document.addEventListener('alpine:init', () => {
	Alpine.data('counter', () => ({
		count: null,

		participating: false,
		get notParticipating() {
			return !this.participating
		},

		errored: false,
		loading: false,

		init() {
			this.count = parseInt(this.$el.dataset.initialCount)
			internalCount = this.count

			subscribeCount((newCount) => this.count = newCount)

			this.$watch("count", (current, previous) => {
				animateRange(150, previous, current, (value) => {
					this.$refs.counter.textContent = formatNumber(value)
				})
			})
		},

		counter: {
			["x-ref"]: "counter",
		},

		button: {
			["x-bind:disabled"]: "loading"
		},

		thanks: {
			["x-bind:data-hidden"]: "notParticipating",
			["x-bind:aria-hidden"]: "notParticipating",
			["x-bind:inert"]: "notParticipating",
			["x-transition"]: null
		},

		error: {
			["x-show"]: "errored",
			["x-transition"]: null
		},

		form: {
			["x-bind:data-hidden"]: "participating",
			["x-bind:aria-hidden"]: "participating",
			["x-bind:inert"]: "participating",

			["x-transition"]: null,
			["x-on:submit"](event) {
				event.preventDefault()

				this.loading = true
				this.errored = false

				incrementCount().then((newCount) => {
					this.count = newCount
					this.participating = true
				}).catch((error) => {
					this.errored = true
					console.log(error)

				}).finally(() => {
					this.loading = false
				})
			}
		},
	}))
})

function animateRange(duration, start, end, callback) {
	if (matchMedia("(prefers-reduced-motion)").matches) {
		callback(end)
	} else {
		let startTimestamp = null;

		const step = (timestamp) => {
			if (!startTimestamp) {
				startTimestamp = timestamp
			};

			const progress = Math.min((timestamp - startTimestamp) / duration, 1)
			callback(Math.floor(progress * (end - start) + start))

			if (progress < 1) {
				requestAnimationFrame(step)
			}
		};

		requestAnimationFrame(step)
	}
}

function formatNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function subscribeCount(onCount) {
	let unsubscribed = false
	let timeoutId = null

	function execute() {
		fetchCount().then(newCount => {
			if (!unsubscribed) {
				timeoutId = setTimeout(execute, 5000)
				onCount(newCount)
			}
		})
	}

	execute()

	return () => {
		unsubscribed = true

		if (timeoutId) {
			clearTimeout(timeoutId)
		}
	}
}

function fetchCount() {
	return fetch("https://c.compteurdegreve.fr/val")
		.then(res => res.json())
		.then(data => data.value)
}

function incrementCount() {
	return fetch("https://c.compteurdegreve.fr/incr", { method: "POST", mode: "cors", credentials: "include"})
		.then(res => res.json())
		.then(data => data.value)
}

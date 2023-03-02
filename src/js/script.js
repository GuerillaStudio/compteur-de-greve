let internalCount = 0

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
			["x-show"]: "participating",
			["x-transition"]: null
		},

		error: {
			["x-show"]: "errored",
			["x-transition"]: null
		},

		form: {
			["x-show"]: "notParticipating",
			["x-transition"]: null,
			["x-on:submit"](event) {
				event.preventDefault()

				this.loading = true
				this.errored = false

				incrementCount().then(() => {
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
				timeoutId = setTimeout(execute, 2000)
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



// fake api
function fetchCount() {
	return wait(1000).then(() => {
		internalCount += randomInt(0, 9)
		return internalCount
	})

}

function incrementCount() {
	return wait(1000).then(() => {
		if (!randomInt(0, 1)) {
			throw new Error()
		}

		internalCount += 1 + randomInt(0, 9)
		return internalCount
	})
}


function wait(ms) {
	return new Promise(res => setTimeout(res, ms))
}

function randomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

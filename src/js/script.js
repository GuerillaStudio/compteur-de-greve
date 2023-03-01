import { createApp } from "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js"


let internalCount = 0


createApp({
	App
}).mount(document.body)

function App({ initialCount }) {
	internalCount = initialCount

	return {
		count: initialCount,
		participating: false,

		async submit(event) {
			event.preventDefault()
			this.count = await incrementCount()
			this.participating = true
		},

		unsubscribeCount: null,

		mounted() {
			this.unsubscribeCount = subscribeCount((newCount) => this.count = newCount)
		},

		unmounted() {
			if (this.unsubscribeCount) {
				this.unsubscribeCount()
				this.countSubcriber = null
			}
		},
	}
}

function subscribeCount(onCount) {
	let unsubscribed = false
	let timeoutId = null

	async function execute() {
		const count = await fetchCount()

		if (!unsubscribed) {
			timeoutId = setTimeout(execute, 2000)
			onCount(count)
		}
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
async function fetchCount() {
	await wait(1000)
	internalCount += randomInt(0, 9)
	return internalCount
}

async function incrementCount() {
	await wait(1000)
	internalCount += 1 + randomInt(0, 9)
	return internalCount
}


function wait(ms) {
	return new Promise(res => setTimeout(res, ms))
}

function randomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

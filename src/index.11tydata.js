const fetch = require("node-fetch")

module.exports = async function() {
	const response = await fetch("https://c.compteurdegreve.fr/val")
	const data = await response.json()
	return {count: data.value}
}

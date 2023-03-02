const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss")

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventySass)

	eleventyConfig.setServerPassthroughCopyBehavior("passthrough")

	eleventyConfig.addPassthroughCopy({
		"node_modules/alpinejs/dist/cdn.min.js": "js/alpine.js"
	})

	eleventyConfig.addPassthroughCopy("src/js/**/*.js")
	eleventyConfig.addPassthroughCopy({ "static": "/" })

	return {
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "public",
		},
	};
};

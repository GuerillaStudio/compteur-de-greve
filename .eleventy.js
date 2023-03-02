const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss")

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
		name: "serverless",
		functionsDir: "./netlify/functions/",
	});

	eleventyConfig.addPlugin(eleventySass)

	eleventyConfig.setServerPassthroughCopyBehavior("passthrough")

	eleventyConfig.addPassthroughCopy({
		"node_modules/alpinejs/dist/cdn.min.js": "js/alpine.js"
	})

	eleventyConfig.addPassthroughCopy("src/js/**/*.js")
	eleventyConfig.addPassthroughCopy({ "static": "/" })

	eleventyConfig.addFilter("formatNumber", number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));

	return {
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "public",
		},
	};
};

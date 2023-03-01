const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss")

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventySass)

	return {
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "public",
		},
	};
};

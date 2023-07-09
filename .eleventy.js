const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(".htaccess");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }

    return minified.code;
  });

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("_site/404.html");
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  eleventyConfig.addCollection("recipes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/recipes/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
  );

  eleventyConfig.addFilter("dump", (value) => {
    console.log(require("util").inspect(value));
    return value;
  });

  eleventyConfig.addCollection("categories", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/recipes/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
      .reduce((acc, curr) => {
        console.log("recipe", curr.data.category);
        if (!acc[curr.data.category]) acc[curr.data.category] = [];
        acc[curr.data.category].push(curr);
        return acc;
      }, {});
  });

  return {
    templateFormats: ["md", "njk", "html", "css"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: false,
    passthroughFileCopy: true,
    pathPrefix: "/",
    dir: {
      input: "src",
    },
  };
};

const path = require("path");
const postcssImport = require("postcss-import");
const postcssUrl = require("postcss-url");
const postcssNesting = require("postcss-nesting");
const postcssCustomMedia = require("postcss-custom-media");
const postcssPresetEnv = require("postcss-preset-env");
const cssnano = require("cssnano");
const { purgeCSSPlugin } = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    postcssImport({
      path: [
        path.posix.join(
          __dirname.replaceAll(path.sep, path.posix.sep),
          "assets",
          "css",
        ),
        path.posix.join(
          __dirname.replaceAll(path.sep, path.posix.sep),
          "node_modules",
        ),
      ],
      resolve: (id) => {
        if (id === "typeface-roboto-slab" || id === "typeface-fira-code") {
          return path.join(__dirname, "node_modules", id, "index.css");
        }

        if (id === "normalize.css/normalize.css") {
          return path.join(__dirname, "node_modules", "normalize.css", "normalize.css");
        }

        return id;
      },
    }),
    postcssUrl([
      {
        filter: "**/typeface-*/files/*",
        url: (asset) => path.posix.join("/", "fonts", path.basename(asset.pathname)),
      },
    ]),
    postcssNesting,
    postcssCustomMedia,
    ...(process.env.HUGO_ENVIRONMENT === "production"
      ? [
          postcssPresetEnv,
          cssnano,
          purgeCSSPlugin({
            content: ["./hugo_stats.json"],
            defaultExtractor: (content) => {
              if (!content.trim()) {
                return ["data-theme"];
              }

              const els = JSON.parse(content).htmlElements;
              return els.tags.concat(els.classes, els.ids);
            },
            safelist: ["data-theme"],
          }),
        ]
      : []),
  ],
};

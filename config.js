const StyleDictionary = require("style-dictionary");

function darkFormatWrapper(format) {
  return function (args) {
    const darkTokens = [];
    const dictionary = {
      ...args.dictionary,
    };

    // Strip out the dark tokens
    dictionary.allTokens = dictionary.allTokens.map((token) => {
      const { darkValue } = token;
      if (darkValue)
        darkTokens.push({
          ...token,
          value: token.darkValue,
          name: token.name + "-dark",
        });
      return token;
    });

    // Add them back in
    dictionary.allTokens = [...dictionary.allTokens, ...darkTokens];

    // Re-assign the dictionary
    return StyleDictionary.format[format]({ ...args, dictionary });
  };
}

module.exports = {
  source: ["tokens/**/*.json"],
  format: {
    cssDark: darkFormatWrapper(`css/variables`),
  },
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      prefix: "dt-",
      files: [
        {
          destination: "base.css",
          format: "cssDark",
          filter: (token) =>
            token.darkValue && token.attributes.category === `color`,
        },
      ],
    },
  },
};

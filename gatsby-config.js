module.exports = {
  siteMetadata: {
    title: "form",
  },
  
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
          name: `Do I need my Sunglasses?`,
          short_name: `Sun`,
          start_url: `/`,
          background_color: `#bada55`,
          theme_color: `#bada55`,
          display: `minimal-ui`,
          icon: `src/images/glasses.png`, // This path is relative to the root of the site.
      },
  },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
          name: `images`,
          path: `${__dirname}/src/images`,
      },
  }
  ],
}

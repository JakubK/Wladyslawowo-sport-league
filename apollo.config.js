module.exports = {
  client: {
    service: {
      // URL to the GraphQL API
      url: 'http://localhost:5000/api/graphql'
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
}
# Landing Page React-Admin OSS

## Development

Install deps with:

```sh
npm install
```

Run the development server with:

```sh
npm run dev
```

## Including in the main Jekyll

Run:

```sh
npm run build
```

This builds and copies the built HTML, CSS and JS files to the root repository. Test that everything works by running Jekyll:

```sh
jekyll server .
```

## Deployment

Push to github. The site will be deployed by the gh-page github action if you worked directly on the `gh-pages` branch or when your work branch is merged into the `gh-pages` branch

xDD Website
-----------

A prototype pretty interface to the xDD API

## Development workflow

This app is built using React and Next.js, a Javascript web framework that allows
relatively simple server-side rendering. A mix of JSX and "hyperscript" semantics
are used for element trees. Typescript is used for editor integrations, but typings
are not complete and errors are swallowed.

[Macrostrat UI components](https://github.com/UW-Macrostrat/ui-components) are
bundled as a submodule.

1. `git submodule update --init`
2. `npm install` (submodule dependencies should also be installed by this step
   using a preinstall hook).
3. `npm run dev` will run the Next.JS dev server for the main codebase. It will
   also run compilation for the UI Component modules in the background. Unfortunately,
   the UI Components produce a lot of typescript errors on compilation, but these
   can be safely ignored.
4. The website should be available on `http://localhost:3000` or similar.

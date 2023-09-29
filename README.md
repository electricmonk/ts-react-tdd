# Yet Another TypeScript Template
This repository aims to serve as an opinionated example for a modern day full-stack web application in TypeScript developed using Outside-In TDD.

### Technological Choices
We aim to justify our choices for the current tech stack, as we believe that *why* is a very important question one should ask itself with regards to software one uses.

#### Yarn + Yarn Workspaces

Yarn comes with several built-in features such as interactive upgrades, the ability to run scripts without using the `run` keyword and a plug-and-play feature for faster installation times (which we currently don't utilize).

We're using yarn workspaces in order to manage dependencies across different packages and hoist all the dependencies to the root level of the project.

We also use yarns [foreach](https://yarnpkg.com/cli/workspaces/foreach) plugin to have a streamlined script execution across all packages.

Both Yarn and NPM have proven a similar level of maturity, however a slightly more convenient ergonomics and overall developer experienced have made us choose Yarn as our current package and workspace manager.

#### TypeScript

Choosing typescript will provide an abundance of self-generated documentation, while maintaining dependencies between different parts of the code both for new features and refactors.

Using typescript will reduce the amount of potential runtime validations, force us to think about the structure and necessity of each part and will help us answer various questions in the realm of YAGNI.

We chose typescript over other solutions (such as ELM, ReasonML or ClojureScript) because it is a superset of javaScript: enriching the language with additional information without the need of learning a different grammar, its paradigms or its overall syntax.

#### Zod

Since the type system is compile-time only, we need some way to assert that the data we think we're parsing from Mongo / HTTP 
actually complies to the schema we defined. Zod is a good TypeScript-first solution for schema management.

#### Fastify

Express is dated, its latest release in October 2022 (as of September 2023) and its API is not Typescript-friendly. Fastify supports Typescript out of the box, with Zod support for schema definition supported by a plugin.

#### React

#### Vite
A modern opinionated bundler with out-of-the-box Typescript support. And it's REALLY fast. 

#### Vitest
Although not without issues, Vitest has proven to be a fast and effective testing library. Its main advantage over Jest is that you have a single config file,
instead of managing separate Jest and Webpack configurations. It integrates very nicely with [React Testing Library](https://github.com/testing-library/react-testing-library) 
and has backwards support for Jest's testing API.

#### Playwright
A mature framework for E2E tests with an API similar to Testing Library.

### Engineering Principles

#### Architecture
##### Ports and Adapters
All I/O operations (UI calls to backend, backend calls to DB, etc) should be abstracted behind adapters (for instance, Repository/DAO pattern for DB access).

##### Dependency Injection
Adapters should be injected into the app using constructor arguments. Each subsystem is responsible for instantiating its internal components and wiring them together. Do not use any DI framework.

#### Testing
##### E2E Testing
Have an E2E test for each major use case, and keep the test as coarse-grained as possible while still asserting that the use case works as expected. For instance, "a customer can add a product to cart and checkout".

##### Feature Testing
Most features should be covered by fast, integrative tests that rely in in-memory fakes in place of the production adapters to remove slow, non-deterministic I/O operations from the equation.

##### Contract Testing
In order to be able to trust the in-memory fakes, each fake will be tested against its respective production adapter using an integration test running against an instance of each adapter type. If the same test passes against both, they are deemed to behave the same way and thus by induction we can assume that the feature tests can be relied on.

##### Bug Fixes
Before fixing a bug, it should be reproduced with a failing test.

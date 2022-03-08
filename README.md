# Yet Another TypeScript Template
This repository aims to serve as an opinionated example for a modern day full-stack web application in TypeScript developed using Outside-In TDD.

### Technological Choices
We aim to justify our technological choices, as we believe that *why* is a very important question one should ask itself with regards to software one uses.

#### Yarn

#### Lerna

Lerna is a very thin layer on top of Yarn Workspaces which allows us to easily streamline and unify versions between packages, while also executing packages simultaneously.

The packages that are executed together, emit their output into the same buffer with their respective names.

We chose Lerna as it is a minimal solution that elevates Yarn workspaces - our choice for the workspace manager of this project.

#### TypeScript

#### React

#### Jest
Although not without issues, Jest has proven to be a mature and effective testing library. It offers a more cohesive framework than the alternative (Mocha/Chai),
it integrates very nicely with [React Testing Library](https://github.com/testing-library/react-testing-library) and its plugin API is less messy in our opinion.

#### Puppeteer

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
Before fixing a bug, it should be reproduced in a failing test.

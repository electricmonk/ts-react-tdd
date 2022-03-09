# Yet Another TypeScript Template
This repository aims to serve as an opinionated example for a modern day full-stack web application in TypeScript developed using Outside-In TDD.

### Technological Choices
We aim to justify our technological choices, as we believe that *why* is a very important question one should ask itself with regards to software one uses.

#### Yarn

#### Lerna

#### TypeScript

Choosing typescript will provide an abundance of self-generated documentation, while maintaining dependencies between different parts of the code both for new features and refactors.

Using typescript will reduce the amount of potential runtime validations, force us to think about the structure and necessety of each part and will help us answer various questions in the realm of YAGNI.

We chose typescript over other solutions (such as ELM, ReasonML or ClojureScript) because it is a superset of javascript, it enriches it with additional information without the need of learning a different language, its paradigms or its syntax.

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

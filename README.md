[![Logo][jhipster-image]][jhipster-url]

# JHipster Light ⚡

[![Build Status][github-actions-jhlight-image]][github-actions-url]
[![Coverage Status][codecov-image]][codecov-url]

## Description

JHipster is a development platform to quickly generate, develop & deploy modern web applications & microservice architectures.

**JHipster Light** will help you to start your project, by generating step by step what you need.

## Prerequisites

### Java

You need to have Java 17 :

- [JDK 17](https://openjdk.java.net/projects/jdk/17/)

### Node.js and NPM

This part is needed if you want to contribute to the project.

- [Node.js](https://nodejs.org/): we use Node to run a prettier as code formatter.
  Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm ci
```

## Test the project

To launch tests:

```
./mvnw clean test
```

To launch tests and integration tests:

```
./mvnw clean verify
```

## Run the project

You can run the project using Maven:

```
./mvnw spring-boot:run
```

Or, first, you can package as jar:

```
./mvnw package
```

Then, run:

```
java -jar target/*.jar
```

Then navigate to http://localhost:7471/swagger-ui.html in your browser.

## Generate your project

You can use this JSON to generate a project:

<!-- prettier-ignore-start -->
```yaml
{
  "folder": "/tmp/beer",
  "generator-jhipster": {
    "projectName": "Beer Project",
    "baseName": "beer",
    "prettierDefaultIndent": 2,
    "packageName": "tech.jhipster.beer"
  }
}
```
<!-- prettier-ignore-end -->

You can use different API to:

- init the project
- add Maven Java as Build Tool
- add Java Base classes and Domain Error
- add Spring Boot as Server Framework
  - add Spring Boot MVC
    - add Tomcat or Undertow
    - add Spring Security with JWT
  - add Database
    - add PostgreSQL
    - add Liquibase as Database Migration Tool

[github-actions-jhlight-image]: https://github.com/pascalgrimaud/jhipster-light/workflows/build/badge.svg
[github-actions-url]: https://github.com/pascalgrimaud/jhipster-light/actions
[codecov-image]: https://codecov.io/gh/pascalgrimaud/jhipster-light/branch/main/graph/badge.svg?token=TGYTFIF15C
[codecov-url]: https://codecov.io/gh/pascalgrimaud/jhipster-light
[jhipster-image]: https://raw.githubusercontent.com/jhipster/jhipster-artwork/main/logos/JHipster%20RGB-small100x25px.png
[jhipster-url]: https://www.jhipster.tech/

<!-- jhipster-needle-readme -->

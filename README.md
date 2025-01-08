# Shorter Than You Know

**Shorter Than You Know** is a project designed to simplify the management and sharing of links. The main goal is to provide a system that allows users to create shorter links than the original ones, making them easier to manage and share them.

The project consists of two main parts:

- **Back-End**: Developed in Go, it handles all the server-side logic and operations. The `back-end` directory contains the source code and configuration files needed to run the link shortening service.
- **Front-End**: Built with React, it offers an intuitive and user-friendly interface to interact with the service (not extremely necessary). The `front-end` directory includes the source code and resources required for the web application to function.

## <a name="commit"></a> Commit Message Format

This documentation explain how to read the project's commit format. It was inspired by the [Angular's one](https://github.com/angular/angular/blob/main/CONTRIBUTING.md).

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs".
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.

### <a name="commit-header"></a>Commit Message Header

```
<project part>[<type>]: <short summary / title>
  │       │             │
  │       │             └─⫸ Commit Summary: Summary in present tense (like a title)
  │       │
  │       └─⫸ Commit Type: CHORE|DOCS|FEAT|FIX|OTHER|PERF|REFACTOR|STYLE|TEST
  │
  └─⫸ Project part: BE(Back-End)|FE(Front-End)
```

The `<type>` and `<summary/title>` fields are mandatory. The `<project part>` should not be present unless the commit affects the entire project.

#### Type

The following table explains how to chose the commit type.

|   **Type**   | **Meaning**                                                                                         |
| :----------: | :-------------------------------------------------------------------------------------------------- |
|  **chore**   | Changes to the build process or auxiliary tools and libraries such as documentation generation      |
|   **docs**   | Documentation only changes                                                                          |
|   **feat**   | Added a new feature                                                                                 |
|   **fix**    | Added a bug fix                                                                                     |
|  **other**   | Any other type of changes that do not fall within the specified types, for this they _must be rare_ |
|   **perf**   | A code change that improves performance                                                             |
| **refactor** | A code change that neither fixes a bug nor adds a feature                                           |
|  **style**   | Changes that do not affect the meaning of the code (white-space, formatting, indentation, etc)      |
|   **test**   | Adding missing tests or correcting existing tests                                                   |

#### Summary

Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### <a name="commit-body"></a>Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

#### <a name="commit-footer"></a>Commit Message Footer

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.
For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Breaking Change section should start with the phrase `BREAKING CHANGE: ` followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with `DEPRECATED: ` followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.

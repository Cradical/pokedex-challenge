# Notes for the evaluator

What a great project this is! I didn't have experience writing any graphQL code prior to this! So, I spent quite a bit of time reading up on the docs as I was going along. I also hadn't used lodash prior but what a great utility! I just wanted to point out some things for improvement in this implementation:

- I saw a potential opportunity for the Search component and the Pokemon display component to share the same query. I started down that path thinking it would be good to give knowledge of the user input in the Search component to the parent (Pokemon.tsx). I ran into some rendering issues in the Search component after the query ran because of re-rendering the results and how the input element was wired up. So, I left it a bit less eloquent to timebox it and move on with the rest of the challenge.
- I also thought about writing a query to pull back all the possible Types and Weaknesses that are required for the filtering feature. I thought this was a much better implementation instead of just sifting through the very long json data file to see what was available as it wouldn't be feasible in a very large dataset. Then with the data brought back from querying the Types and Weaknesses you could dynamically build your filter list.
- I resorted to hard coding some values based on what I saw in the json file and had ran into some issues with setting up the JS functions in the resolver to meet the filtering requirement listed in the readme. I think I ran out of brain juice here 🤯. I came up with a messy nested for loop (not included in the code as of 5pm Friday 8/7/2020) in a repl to filter the objects but I will see if something better comes to me in the evening.
- I would be happy to chat more about the code and would be especially keen to do a bit of pairing. I would love to learn more.

# The Challenge

This repository is the source code for an incomplete, pretend "Pokédex" web app. It's a code challenge, the challenge being to finish the web app by implementing a few last minute major features in the UI and API.

# Getting Started

## Cloning the Repo

You'll want to start by cloning the repo. (Instructions on cloning repos can be found here: https://help.github.com/en/articles/cloning-a-repository.) Next, you'll want to make sure Node is installed (v12) as well as Yarn (v1, https://classic.yarnpkg.com/lang/en/). Now you're ready to run the UI and API locally

## Running the UI/API

To run the UI and the API locally, just run `yarn start` or `yarn dev` from both the `api` and `ui` folders. Both dev servers should automatically talk to each other.

_Note: In order to avoid any discrepancies running the dev servers, please make sure you're using Node ^12.8.0._

## The Tasks

1. Implement Searching on the UI & API

- The user should be able to type in a search query in a search box and get fuzzy matches based on the pokemon name. For example, if a user types in "charzirard" into the search box, the search results should show Charizard, but also Charmander, Charmeleon, and perhaps even others based on fuzzy matching of the text.
- Build out a search box that makes search queries to the API
- Implement a fuzzy search resolver in the API

2. Implement filtering on the UI & API

- The user should be able to filter the list of pokemon by their types and weaknesses. Multiple filters should be able to be applied. Multiple filters should follow the "AND" paradigm vs the "OR" paradigm, meaning additional filters should narrow down results, not expand them. For example, if a user chooses the "FLYING" type and the "FIRE" type, you should filter down the pokemon to only those with **both** the "FLYING" and "FIRE" types. Charizard would show up in this list, but Charmander would not, because it does not have the "FLYING" type. Combining type filters with weakness filters should operate in the same way, narrowing down your search results.
- Build out filter checkboxes or dropdowns or menus that add filter arguments to your `pokemonMany` query to the API
- Implement filtering on the `pokemonMany` query within the API, handling both `types` and `weaknesses` filters

# Tips

Here's some tips you might find handy:

- If you use an IDE like VS Code or Atom, install the ESLint and Prettier extensions. They help development a _lot!_
- Don't focus too much on UX or pretty design. Focus more on meeting the Acceptance Criteria and writing clean code.
- We're fans of the Functional Programming paradigm. As you code, thinking about how you can make your functions pure and avoid mutating objects.

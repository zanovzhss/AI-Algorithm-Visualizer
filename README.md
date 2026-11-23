# AI Lab — Algorithm Visualizer
Zanov Zhanarys · QAIRU · AI Fundamentals Final Project 2026

Interactive educational application with three syllabus weeks:
- Week 2: A* with Manhattan heuristic, obstacles, editable endpoints, animation and steps.
- Week 3: steepest-ascent Hill Climbing on a one-dimensional discrete landscape; editable values and starting index; local/global maximum comparison.
- Week 4: full-depth Minimax for tic-tac-toe; human X, AI O, candidate scores and evaluated-state count.

## Run locally
Extract this project. Open `dist/index.html` in Chrome, Edge, Firefox or Safari. No installation, account, API key or internet connection is needed for the downloaded copy.
Alternatively, run `python -m http.server 8000 --directory dist` and open http://localhost:8000.

## Tests
Install Node.js if needed, then run `node tests/algorithms.test.cjs` from this project directory. No npm packages are required.
24 algorithm tests pass, including A* compared with an independent BFS on 80 seeded maps and exhaustive human-play branches against Minimax (569 terminal branches, no human wins).

## Architecture
`dist/algorithms.js` contains independent algorithm implementations, exported for both browser and Node.js.
`dist/app.js` controls editable state, DOM rendering and visualization.
`dist/style.css` contains responsive styling.
`dist/index.html` contains the Kazakh-language interface and defense guide.
`docs/REPORT_KK.md` explains the methods, validation and limitations.
`docs/DEFENSE_KK.md` contains a demo script, seven-slide outline and likely questions.
`docs/DECLARATIONS_KK.md` is an honest AI-use declaration and a contribution template to complete after personal review.

## GitHub submission
Create a repository in your own GitHub account, upload this source, then submit its URL. A GitHub repository has NOT been created by this package. The deployment's managed source repository is not a substitute for the required GitHub submission.
Do not upload credentials. `.openai/hosting.json` contains only hosting configuration and can be omitted for GitHub if desired.

## Before submission
Review and understand all three algorithms. Confirm topic approval with your instructor. Capture screenshots from your running app, prepare the final 5–7 slides from the outline, and record a 2–3 minute demo. This package does not include a recorded video or a finished slide deck.

## Version 2 — exploration features
A*: choose A* or BFS; compare path lengths, explored nodes and measured calculation time on the same map. Generate deterministic random obstacle maps using a seed and density. View g/h/f for visited cells; step forward, back, or jump to the result. Seeded maps may be unreachable.
Hill Climbing: use local-maximum, plateau and single-peak examples; inspect step history; run 1–20 seeded random restarts and display any individual run. Restarts improve coverage but do not guarantee the global maximum.
Minimax: choose the first player, undo the last human/AI round, and inspect the last decision's two-level tree with board previews and opponent reply values. Hard uses full-depth Minimax. Medium searches three plies and uses an open-line heuristic at nonterminal cutoff states. Easy chooses a random legal move, explicitly not Minimax. Changing game settings starts a new game.

Additional validation: A* and BFS agree on 100 generated maps; full Minimax is unbeaten whether human or AI starts. See docs/TEST_RESULTS.txt.

## Optional interface integration checks
Run `npm install --no-save jsdom`, then `node tests/interface.test.cjs`. These 11 DOM integration tests cover controls, map comparison, restarts, tree rendering, AI-first mode and undo. They do not replace a visual browser check. The app itself needs no npm dependencies.

## DFS update
Select DFS in the pathfinding dropdown. Iterative depth-first graph search uses a LIFO stack and explores neighbors in up, right, down, left order. A*, BFS and DFS now share the comparison table. DFS reports a found route without claiming optimality. BFS/A*/DFS remain within syllabus week 2; Hill Climbing and Minimax cover weeks 3 and 4.
Validation: 24 algorithm tests and 11 interface integration tests. On 100 generated maps DFS agrees with BFS on reachability and produces legal cycle-free paths. A 2×3 empty-grid example shows DFS taking 5 moves while BFS takes 1.

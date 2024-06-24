# Minesweeper

## Local Development Setup

### Backend

Setup venv

```
// install virtualenv
pip install virtualenv

// macos
source env/bin/activate

// windows
./env/Scripts/activate

// validate piplist
pip list --local

```

Install packages

```
pip install -r ./requirements.txt
```

Run server

```
python manage.py runserver
```

### Frontend

From the `ui` directory, run the following:

Install packages

```
yarn
```

Run app locally

```
yarn dev
```

## To do

- add docker (optional)
- add linting
- add prettier

- backend performance optimization
- ajax request support

- unit tests

- unit tests
- accessibility support
- victory screen

- loading indicators

- "no guess" game variation
- store flags in backend
- update color palette to fellow

- fix double GET on game-page

- fix failed create daily on first try

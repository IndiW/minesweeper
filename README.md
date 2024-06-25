# :bomb: Sweeper

The classic minesweeper game brought to you in React and Django. In this first edition, when the time runs out the bombs will explode -> so be quick!

Frontend: React, ShadCDN, Tailwind

Backend: Django, SQLLite

## Local Development Setup

### Backend

Setup venv

```ts
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

Technical

- add unit testing (FE and BE)
- add linting
- add prettier
- production build
- save timer state between games / renders

Features

- 'How to play' page
- "no guess" game variation
- customization (bomb count, grid size, time etc)

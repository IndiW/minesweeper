# :bomb: Sweeper

The classic minesweeper game brought to you in React and Django. In this first edition, when the time runs out the bombs will explode -> so be quick!

Frontend: React, ShadCDN, Tailwind

Backend: Django, SQLLite

## Local Development Setup (Docker)

If you're using docker, from the project directory run:

```
docker-compose build
```

followed by

```
docker-compose up
```

And visit `http://localhost:8080` to access the site.

## Local Development Setup (Alternative)

Alternatively you can run the django server and react without docker:

### Backend

Setup venv

```ts
// install virtualenv
pip install virtualenv

// create virtualenv
python -m venv env

// macos
source env/bin/activate

// windows
./env/Scripts/activate

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
- api input validation

Features

- 'How to play' page
- "no guess" game variation
- customization (bomb count, grid size, time etc)

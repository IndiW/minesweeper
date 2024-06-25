FROM python:3.12.4-alpine

ENV PYTHONUNBUFFERED=1

RUN mkdir -p /api
WORKDIR /api

RUN pip install --upgrade pip

COPY . .

RUN python3 -m pip install -r ./requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
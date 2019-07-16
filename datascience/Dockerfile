FROM python:3.6.8-jessie
RUN mkdir /app
RUN mkdir -p /var/log/uwsgi
WORKDIR /app
COPY requirements.txt .
COPY requirements_dev.txt .
RUN pip install -r requirements.txt
RUN pip install -r requirements_dev.txt
RUN apt-get update -y && apt-get install -y nginx
COPY openelections/api/nginx.conf /etc/nginx/nginx.conf
ADD . .
WORKDIR /app/openelections/api

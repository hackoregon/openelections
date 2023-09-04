FROM python:3.6.15-buster

RUN mkdir /app
RUN mkdir -p /var/log/uwsgi

WORKDIR /app

COPY requirements.txt .
COPY requirements_dev.txt .

RUN pip install -r requirements.txt
RUN pip install -r requirements_dev.txt

# force update sources.list (sketchy, but good for now until we update container)
# RUN echo "deb http://archive.ubuntu.com/ubuntu xenial main universe" > /etc/apt/sources.list \
#   && echo "deb http://archive.ubuntu.com/ubuntu xenial-updates main universe" >> /etc/apt/sources.list \
#   && echo "deb http://security.ubuntu.com/ubuntu xenial-security main universe" >> /etc/apt/sources.list

# RUN apt-get update -y && apt-get install --force-yes -y nginx
RUN apt-get update -y && apt-get install -y nginx

COPY openelections/api/nginx.conf /etc/nginx/nginx.conf

ADD . .

WORKDIR /app/openelections/api

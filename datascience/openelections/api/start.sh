uwsgi --ini /app/openelections/api/wsgi.ini
nginx
tail -f /app/openelections/api/wsgi.log /var/log/nginx/access.log /var/log/nginx/error.log

FROM php:7-fpm
COPY ./src /var/www/html
EXPOSE 9000

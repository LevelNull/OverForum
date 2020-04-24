FROM mysql
ENV DEFAULT-AUTHENTICATION-PLUGIN=mysql_native_password
RUN apt-get update && apt-get -y upgrade
COPY ./config/setup.sh /docker-entrypoint-initdb.d/setup.sh
COPY ./config/overforum.sql /docker-entrypoint-initdb.d/overforum.sql
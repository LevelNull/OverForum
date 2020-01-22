FROM node:10
RUN mkdir /var/overforum
ADD ./config/init.sh /init.sh
ADD ./config/wait.sh /wait.sh
ADD ./code /var/overforum
WORKDIR /var/overforum
RUN npm i
RUN chmod +x /init.sh && chmod +x /wait.sh
ENTRYPOINT ["/init.sh"]
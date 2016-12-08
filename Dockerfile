
FROM centos:centos6
MAINTAINER Thanh Truong
LABEL Name=salon-cloud Version=lastest
RUN yum -y update; yum clean all
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN yum install -y nodejs
RUN npm install -g typescript nodemon mocha nyc codecov
ADD . /salon-cloud
RUN cd /salon-cloud && npm install
WORKDIR /salon-cloud
EXPOSE 3000
CMD tsc test/*.ts --module commonjs --sourcemap --target es6
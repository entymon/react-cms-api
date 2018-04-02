FROM node:latest AS NODE

RUN mkdir -p /app
ENV HOME=/app

WORKDIR $HOME

# Install Yarn
RUN rm /usr/local/bin/yarn && rm /usr/local/bin/yarnpkg
RUN rm -rf /opt/yarn

RUN npm install -g yarn
RUN yarn --version

COPY package.json app/
COPY .env app/
RUN yarn

COPY . /app

EXPOSE 4000

CMD [ "yarn", "start" ]

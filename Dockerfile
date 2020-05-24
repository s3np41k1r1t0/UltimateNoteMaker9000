FROM node:14

#sets workdir
WORKDIR /usr/src/app

#installs dependencies
COPY package*.json ./
RUN npm install

COPY . .

#prevents port binding issues
EXPOSE 3000

CMD ["npm","start"]

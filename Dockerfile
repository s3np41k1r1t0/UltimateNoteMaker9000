FROM node:14

#sets workdir
WORKDIR /usr/src/app

#installs dependencies
COPY package*.json ./
RUN npm install

COPY . .

#prevents port binding issues
EXPOSE 3000

RUN export SECRET=`head -c 16 /dev/urandom | base64` 

CMD ["npm","start"]

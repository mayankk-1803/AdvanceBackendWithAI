FROM node

WORKDIR /app

# Layers
COPY package*.json .

RUN npm install
COPY . .

CMD ["npm", "start"]

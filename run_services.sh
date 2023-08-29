#!/bin/bash



export FRONTEND_URL=http://${FRONT_URL}:3000
export MONGO_URL=${MONGODB_URL}
export MONGO_USER=user
export MONGO_PASS=resu
export MONGO_ROOT_USER=root
export MONGO_ROOT_PWD=toor
export MONGO_DB_NAME=bunbun

cd /app
ls
node db.js

# Start the first process
cd /app
npm start
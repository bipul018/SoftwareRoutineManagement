#!/bin/bash


export FRONTEND_URL=${APP_BASE_URL}:3000
export MONGO_URL=mongodb://172.17.0.2:27017
export MONGO_USER=user
export MONGO_PASS=resu
export MONGO_ROOT_USER=root
export MONGO_ROOT_PWD=toor
export MONGO_DB_NAME=bunbun
export REACT_APP_BACKEND_URL=${APP_BASE_URL}:5040

cd /app
ls
node db.js

# Start the first process
cd /app
npm start
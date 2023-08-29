#!/bin/bash


export FRONTEND_URL=https://${APP_BASE_URL}:3000
export MONGO_URL=mongodb://${MONGODB_URL}:27017
export MONGO_USER=user
export MONGO_PASS=resu
export MONGO_ROOT_USER=root
export MONGO_ROOT_PWD=toor
export MONGO_DB_NAME=bunbun
export REACT_APP_BACKEND_URL=https://${APP_BASE_URL}:5040

cd /app/backendA
ls
node db.js

# Start the second process
cd /app/frontendA
ls
npm start dev &

# Start the first process
cd /app/backendA
npm start

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
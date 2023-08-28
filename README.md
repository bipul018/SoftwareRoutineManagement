# SoftwareProject
First install docker in the system to run

Then need to make a .env file in root folder {if not created already}
In .env file, need to set following environment variables before starting docker-compose
MONGO_PORT=27017
MONGO_ADMIN=root
MONGO_PASSWORD=toor
MONGO_DB_USER=user
MONGO_DB_PWD=resu
MONGO_DB_NAME=bunbun

Also need to set these variables, but can be set to anything:
#Need to forward these two ports
BACKEND_PORT=<Set a port where backend server runs>
FRONTEND_PORT=<Set a port where frontend server runs>
#Need to set this url to the public url that the app finally should use
APP_BASE_URL=<Set the base url of server where webapp is hosted, eg for local run set http://localhost>


After setting all the required environment variables, 
setup docker using 
docker-compose build
Then start services using
docker-compose up


Now access the app using the just above set app url followed by frontend port 
<url>:<frontend port>

For eg if 
FRONTEND_PORT=2999
and
APP_BASE_URL=http://localhost
access as 
http://localhost:2999
FROM node:20.3


WORKDIR /app/
COPY package.json ./
COPY package-lock.json ./
RUN ls

RUN npm i
RUN ls

COPY ./ ./
RUN ls

COPY run_services.sh .
EXPOSE 3000
ENV CI=true
CMD ["/bin/bash", "-c", "/app/run_services.sh"]

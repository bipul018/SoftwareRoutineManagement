FROM node:20.3

WORKDIR /app/backendA/
COPY backendA/package.json ./
COPY backendA/package-lock.json ./
RUN ls

WORKDIR /app/frontendA/
COPY frontendA/package.json ./
COPY frontendA/package-lock.json ./
RUN ls

RUN npm i
RUN ls

WORKDIR /app/backendA/
RUN npm i
RUN ls

WORKDIR /app/
RUN ls

COPY ./ ./
RUN ls

COPY run_services.sh .

RUN chmod +x /app/run_services.sh
WORKDIR /app/



EXPOSE 5040
EXPOSE 3000
ENV CI=true

CMD ["/bin/bash", "-c", "/app/run_services.sh"]

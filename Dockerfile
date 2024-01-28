FROM node:20-alpine

WORKDIR /app

RUN apk update && \
    apk add --no-cache \
        build-base \
        cmake

COPY package.json package-lock.json .


COPY .env .
COPY custom-next-env.d.ts .
COPY next-env.d.ts .
COPY next.config.mjs .
COPY postcss.config.cjs .
COPY sst-env.d.ts .
COPY sst.config.ts .
COPY tailwind.config.ts .
COPY tsconfig.json .
COPY prisma .


RUN npm install -g npm@10.4.0
RUN npm i

ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run plain-start

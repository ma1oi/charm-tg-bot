FROM oven/bun:1.2.5 as builder

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "start"]

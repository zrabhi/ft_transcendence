#!/usr/bin/env bash

sleep 2
npx prisma migrate dev --name init

exec "$@"
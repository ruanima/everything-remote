#!/bin/sh

export NODE_ENV=DEBUG
BROWSER=none npm run start &
sleep 5
npm run electron-start

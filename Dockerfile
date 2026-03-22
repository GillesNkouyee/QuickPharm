FROM node:8.11.3

ENV APP_BUNDLE_DIR=/opt/quickpharm \
    PORT=3000 \
    BIND_IP=0.0.0.0 \
    METEOR_ALLOW_SUPERUSER=1

WORKDIR ${APP_BUNDLE_DIR}

COPY deploy/bundle/bundle ./bundle

WORKDIR ${APP_BUNDLE_DIR}/bundle/programs/server
RUN npm install --production

WORKDIR ${APP_BUNDLE_DIR}/bundle
EXPOSE 3000

CMD ["node", "main.js"]

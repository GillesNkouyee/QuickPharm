# 1️⃣ Base Node compatible Meteor 1.7
FROM node:14-buster

# 2️⃣ Installer Meteor 1.7
RUN curl https://install.meteor.com/ | sed s/RELEASE=.*/RELEASE=1.7/ | sh

# 3️⃣ Définir le répertoire de travail
WORKDIR /app

# 4️⃣ Copier le projet
COPY . /app

# 5️⃣ Installer les dépendances Meteor côté projet
RUN ~/.meteor/meteor npm install

# 6️⃣ Définir la variable pour autoriser superuser
ENV METEOR_ALLOW_SUPERUSER=1

# 7️⃣ Builder l'application en bundle Node.js
RUN ~/.meteor/meteor build --directory /opt/bundle --allow-incompatible-update --allow-superuser

# 8️⃣ Installer les dépendances du bundle serveur
WORKDIR /opt/bundle/bundle/programs/server
RUN npm install

# 9️⃣ Définir le répertoire final
WORKDIR /opt/bundle/bundle

# 🔟 Exposer le port
EXPOSE 3000

# 1️⃣1️⃣ Lancer l'application avec Node
CMD ["node", "main.js"]

# 1️⃣ Base Node compatible Meteor 1.7
FROM node:14-buster

# 2️⃣ Installer Meteor 1.7 (force la version)
RUN curl https://install.meteor.com/ | sed s/RELEASE=.*/RELEASE=1.7/ | sh

# 3️⃣ Définir le répertoire de travail
WORKDIR /app

# 4️⃣ Copier tous les fichiers de ton projet
COPY . /app

# 5️⃣ Installer les dépendances Meteor côté projet
RUN ~/.meteor/meteor npm install

# 6️⃣ Builder l'application Meteor en bundle Node.js
RUN ~/.meteor/meteor build --directory /opt/bundle --allow-incompatible-update

# 7️⃣ Installer les dépendances du serveur du bundle
WORKDIR /opt/bundle/bundle/programs/server
RUN npm install

# 8️⃣ Définir le répertoire final
WORKDIR /opt/bundle/bundle

# 9️⃣ Exposer le port
EXPOSE 3000

# 🔟 Lancer l'application avec Node
CMD ["node", "main.js"]

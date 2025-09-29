# Étape 1 : Image Node compatible avec Meteor 1.7
FROM node:14-buster

# Étape 2 : Installer Meteor 1.7 (pas la dernière)
RUN curl https://install.meteor.com/ | RELEASE=1.7 sh

# Étape 3 : Définir le répertoire de travail
WORKDIR /app

# Étape 4 : Copier les fichiers du projet
COPY . /app

# Étape 5 : Installer les dépendances
RUN meteor npm install

# Étape 6 : Builder l'application Meteor en bundle Node.js
RUN meteor build --directory /opt/bundle --allow-incompatible-update

# Étape 7 : Installer les dépendances côté serveur du bundle
WORKDIR /opt/bundle/bundle/programs/server
RUN npm install

# Étape 8 : Définir le répertoire de travail final
WORKDIR /opt/bundle/bundle

# Étape 9 : Exposer le port utilisé par Render
EXPOSE 3000

# Étape 10 : Lancer l'application avec Node (production)
CMD ["node", "main.js"]

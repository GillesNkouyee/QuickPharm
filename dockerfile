# 1️⃣ Base Node compatible avec Meteor 1.7 FROM node:14-buster 
# 2️⃣ Définir la variable pour autoriser superuser ENV METEOR_ALLOW_SUPERUSER=1 
# 3️⃣ Créer le répertoire de travail WORKDIR /app 
# 4️⃣ Copier le bundle déjà généré (fait en local avec `meteor build --directory deploy/bundle`) COPY deploy/bundle /app 
# 5️⃣ Installer les dépendances du serveur Meteor WORKDIR /app/bundle/programs/server RUN npm install --production 
# 6️⃣ Répertoire final WORKDIR /app/bundle 
# 7️⃣ Exposer le port EXPOSE 3000 
# 8️⃣ Lancer l'application CMD ["node", "main.js"]


# 1️⃣ Utiliser Node 8.15.1 compatible Meteor 1.7
FROM node:8.15.1

# 2️⃣ Définir le dossier de travail
WORKDIR /opt/bundle

# 3️⃣ Copier ton bundle déjà compilé
COPY ./deploy/bundle/bundle ./bundle

# 4️⃣ Installer les dépendances serveur
WORKDIR /opt/bundle/bundle/programs/server
RUN npm install --production

# 5️⃣ Variables d’environnement Render
WORKDIR /opt/bundle/bundle
ENV PORT=3000
ENV ROOT_URL=https://quickpharm-1.onrender.com
ENV MONGO_URL=mongodb+srv://<Gilles-admin>:<Oathniel@Jnmm2024>@cluster0.bgt04et.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV METEOR_ALLOW_SUPERUSER=1

# 6️⃣ Exposer le port de l’app
EXPOSE 3000

# 7️⃣ Lancer Meteor
CMD ["node", "main.js"]


EXPOSE 3000

# 1️⃣1️⃣ Démarrer l’application
CMD ["node", "main.js"]

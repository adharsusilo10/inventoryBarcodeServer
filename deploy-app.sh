# rm -rf dist node_modules
# # npm install
# # npm run build
tar czf inventory-api.tar.gz server
scp inventory-api.tar.gz ubuntu@159.223.33.235:./app
rm inventory-api.tar.gz

ssh ubuntu@159.223.33.235 <<'ENDSSH'
  cd app
  tar xf inventory-api.tar.gz
  rm inventory-api.tar.gz
  exit
ENDSSH

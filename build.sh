rm -rf ./build
ncc build src/server.ts -o ./build
cp package.json package-lock.json yarn.lock ./build
mkdir ./build/public
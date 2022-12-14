# Simple wordcloud app

This application allows users to hit an api endpoint or use a form to add blockers to a DB which is then rendered on the UI.

The more something is added (lets say you enter knowledge) it'll show that as a larger object in the wordcloud.

# Non k3s startup

The startup.sh sets up a DB using docker and also sets up some environment variables.

# K3s build and deploy

For this to work you'll need to setup k3s: https://k3s.io/

The dashboard tool I'm using is Octant: https://octant.dev/ 

## Build and push the app image

To build the application image I used pack cli from https://buildpacks.io/

To build the app  and push the image your self run this command:

```shell
export DOCKER_HUB_NAME=your docker hub name

pack build $DOCKER_HUB_NAME/wordcloud-app \
    --env "MONGODB_URI=mongodb://test:abc123@0.0.0.0:27017/" \
    --builder paketobuildpacks/builder:base

docker push $DOCKER_HUB_NAME/wordcloud-app
```

## Deploy to k3s

To deploy this application we're going to use helm v3.

Lets create a namesapce using kubectl:

```shell
kubectl create namespace wordcloud-app
```

Now lets deploy our helm chart:

```shell
helm -n wordcloud-app upgrade \
    wordcloud-app \
    ./wordcloud-chart \
    --set wordcloudImage.repository=$DOCKER_HUB_NAME/wordcloud-app \
    --install \
    --debug
```

Once this has run you can hit your app on the ingress endpoint which you can fetch by running:

```shell
export PRES_SERVICE_IP=$(kubectl get svc --namespace wordcloud-apppresentation-service --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")

export WC_SERVICE_IP=$(kubectl get svc --namespace wordcloud-appwordcloud-service --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")

echo http://$PRES_SERVICE_IP:8080
echo http://$WC_SERVICE_IP:8081
```

Now you're done! Woohoo!!
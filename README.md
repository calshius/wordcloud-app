# Simple wordcloud app

This application allows users to hit an api endpoint or use a form to add blockers to a DB which is then rendered on the UI.

The more something is added (lets say you enter knowledge) it'll show that as a larger object in the wordcloud.

# Non k3s startup

The startup.sh sets up a DB using docker and also sets up some environment variables.

# K3s build and deploy

For this to work you'll need to setup k3s: https://k3s.io/

To setup the ashboard for k3s see these docs: https://docs.k3s.io/installation/kube-dashboard 

To fetch the token run this:
```shell
sudo k3s kubectl -n kubernetes-dashboard create token admin-user
```

Exposing the dashboard url:
```shell
sudo k3s kubectl proxy
```

Finally it can be reached on:
```shell
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

## Build and push the app image

To build the application image I used pack cli from https://buildpacks.io/

To build the app  and push the image your self run this command:

```shell
export DOCKER_HUB_NAME=your docker hub name

pack build $DOCKER_HUB_NAME/test-wordcloud  \
    --env "MONGODB_URI=mongodb://test:abc123@0.0.0.0:27017/" \
    --builder paketobuildpacks/builder:base

docker push $DOCKER_HUB_NAME/test-wordcloud 
```

## Deploy to k3s

To deploy this application we're going to use helm v3.

Lets create a namesapce using kubectl:

```shell
kubectl create namespace test-wordcloud 
```

Now lets deploy our helm chart:

```shell
helm -n test-wordcloud upgrade \
    test-wordcloud  \
    ./wordcloud-chart \
    --set wordcloudImage.repository=$DOCKER_HUB_NAME/test-wordcloud  \
    --install \
    --debug
```

Once this has run you can hit your app on the ingress endpoint which you can fetch by running:

```shell
export APP_ENDPOINT=$(kubectl get ing  test-wordcloud -wordcloud-chart -o jsonpath="{.status.loadBalancer.ingress[0].ip}")
echo "Get the your app here: http://$APP_ENDPOINT "
```

Now you're done! Woohoo!!

# Disclaimer

Wrote this to get used to using nextjs, this is just a learning thing.
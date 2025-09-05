#!/bin/bash

# Portfolio GitHub-to-OpenShift Deployment Script (Standalone)
# This script will deploy directly from GitHub to your OpenShift cluster
# Usage: ./github-deploy.sh [environment] [project-name]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME=${2:-portfolio}
NAMESPACE=${PROJECT_NAME}-${ENVIRONMENT}
GITHUB_REPO="https://github.com/splax-s/splax-portfolio.git"
DOMAIN_SUFFIX="apps.test.mtnn.cloud"

echo "🚀 Starting GitHub-to-OpenShift deployment..."
echo "📁 Project: ${PROJECT_NAME}"
echo "🌍 Environment: ${ENVIRONMENT}"
echo "📍 Namespace: ${NAMESPACE}"
echo "🔗 GitHub Repo: ${GITHUB_REPO}"
echo "🌐 Domain: ${DOMAIN_SUFFIX}"

# Check if oc CLI is available
if ! command -v oc &> /dev/null; then
    echo "❌ OpenShift CLI (oc) not found. Please install it first."
    exit 1
fi

# Check if logged in to OpenShift
if ! oc whoami &> /dev/null; then
    echo "❌ Not logged in to OpenShift. Please run 'oc login' first."
    exit 1
fi

echo "👤 Logged in as: $(oc whoami)"
echo "🏠 Current server: $(oc whoami --show-server)"

# Create or switch to project
if oc get project ${NAMESPACE} &> /dev/null; then
    echo "📂 Switching to existing project: ${NAMESPACE}"
    oc project ${NAMESPACE}
else
    echo "🆕 Creating new project: ${NAMESPACE}"
    oc new-project ${NAMESPACE} --display-name="Portfolio ${ENVIRONMENT^}" --description="Portfolio application - ${ENVIRONMENT} environment"
fi

# Set environment-specific variables
if [ "$ENVIRONMENT" == "development" ] || [ "$ENVIRONMENT" == "dev" ]; then
    ROUTE_HOST="portfolio-dev.${DOMAIN_SUFFIX}"
    REPLICAS=1
    MEMORY_REQUEST="128Mi"
    MEMORY_LIMIT="256Mi"
    CPU_REQUEST="100m"
    CPU_LIMIT="250m"
    NODE_ENV="development"
elif [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "prod" ]; then
    ROUTE_HOST="portfolio-prod.${DOMAIN_SUFFIX}"
    REPLICAS=3
    MEMORY_REQUEST="512Mi"
    MEMORY_LIMIT="1Gi"
    CPU_REQUEST="300m"
    CPU_LIMIT="750m"
    NODE_ENV="production"
else
    ROUTE_HOST="portfolio.${DOMAIN_SUFFIX}"
    REPLICAS=1
    MEMORY_REQUEST="256Mi"
    MEMORY_LIMIT="512Mi"
    CPU_REQUEST="200m"
    CPU_LIMIT="500m"
    NODE_ENV="production"
fi

echo "📋 Creating ImageStream..."
oc apply -f - <<EOF
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: portfolio
  labels:
    app: portfolio
    environment: ${ENVIRONMENT}
spec:
  lookupPolicy:
    local: false
EOF

echo "🔨 Creating BuildConfig..."
oc apply -f - <<EOF
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: portfolio-build
  labels:
    app: portfolio
    environment: ${ENVIRONMENT}
spec:
  failedBuildsHistoryLimit: 5
  output:
    to:
      kind: ImageStreamTag
      name: portfolio:latest
  runPolicy: Serial
  source:
    git:
      uri: ${GITHUB_REPO}
      ref: main
    type: Git
  strategy:
    type: Docker
    dockerStrategy:
      dockerfilePath: Dockerfile.openshift
  successfulBuildsHistoryLimit: 5
  triggers:
  - type: ConfigChange
  - type: GitHub
    github:
      secret: portfolio-webhook-secret
  - imageChange: {}
    type: ImageChange
EOF

echo "🚢 Creating Deployment..."
oc apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  labels:
    app: portfolio
    environment: ${ENVIRONMENT}
spec:
  replicas: ${REPLICAS}
  selector:
    matchLabels:
      deployment: portfolio
  template:
    metadata:
      labels:
        deployment: portfolio
        app: portfolio
        environment: ${ENVIRONMENT}
    spec:
      containers:
      - name: portfolio
        image: portfolio:latest
        env:
        - name: NODE_ENV
          value: ${NODE_ENV}
        - name: PORT
          value: "8080"
        - name: HOSTNAME
          value: "0.0.0.0"
        - name: NEXT_TELEMETRY_DISABLED
          value: "1"
        ports:
        - containerPort: 8080
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
        resources:
          requests:
            memory: ${MEMORY_REQUEST}
            cpu: ${CPU_REQUEST}
          limits:
            memory: ${MEMORY_LIMIT}
            cpu: ${CPU_LIMIT}
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          runAsNonRoot: true
          seccompProfile:
            type: RuntimeDefault
EOF

echo "🔌 Creating Service..."
oc apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: portfolio
  labels:
    app: portfolio
    environment: ${ENVIRONMENT}
spec:
  ports:
  - name: 8080-tcp
    port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    deployment: portfolio
  type: ClusterIP
EOF

echo "🌐 Creating Route..."
oc apply -f - <<EOF
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: portfolio
  labels:
    app: portfolio
    environment: ${ENVIRONMENT}
spec:
  host: ${ROUTE_HOST}
  port:
    targetPort: 8080-tcp
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  to:
    kind: Service
    name: portfolio
    weight: 100
EOF

# Start a build from GitHub
echo "🏗️  Starting build from GitHub repository..."
oc start-build portfolio-build --follow --wait

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed"
    exit 1
fi

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
oc rollout status deployment/portfolio --timeout=600s

echo "✅ Deployment successful!"
echo "🌍 Application URL: https://${ROUTE_HOST}"

# Test the application
echo "🧪 Testing application..."
sleep 15
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${ROUTE_HOST} || echo "000")

if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ Application is responding correctly!"
else
    echo "⚠️  Application might not be ready yet (HTTP ${HTTP_STATUS})"
    echo "   Try accessing it manually in a few minutes"
fi

echo ""
echo "📊 Deployment Status:"
echo "   Project: ${NAMESPACE}"
echo "   Environment: ${ENVIRONMENT}"
echo "   Replicas: ${REPLICAS}"
echo "   Resources: ${CPU_REQUEST}-${CPU_LIMIT} CPU, ${MEMORY_REQUEST}-${MEMORY_LIMIT} Memory"
echo "   Pods: $(oc get pods -l deployment=portfolio --no-headers 2>/dev/null | wc -l | tr -d ' ') running"
echo "   Build: $(oc get builds --sort-by=.metadata.creationTimestamp -o name 2>/dev/null | tail -1 | cut -d'/' -f2)"
echo "   Route: ${ROUTE_HOST}"

echo ""
echo "💡 Useful commands:"
echo "   View pods: oc get pods"
echo "   View logs: oc logs -f deployment/portfolio"
echo "   View builds: oc get builds"
echo "   Scale app: oc scale deployment portfolio --replicas=5"
echo "   Delete all: oc delete project ${NAMESPACE}"

# Setup GitHub webhook (optional)
echo ""
echo "🔗 GitHub Webhook Setup:"
echo "   Add this webhook URL to your GitHub repository:"
WEBHOOK_SECRET=$(oc get bc portfolio-build -o jsonpath='{.spec.triggers[?(@.type=="GitHub")].github.secret}' 2>/dev/null || echo "portfolio-webhook-secret")
CLUSTER_URL=$(oc whoami --show-server)
echo "   ${CLUSTER_URL}/apis/build.openshift.io/v1/namespaces/${NAMESPACE}/buildconfigs/portfolio-build/webhooks/${WEBHOOK_SECRET}/github"
echo "   Content-Type: application/json"
echo "   Events: Push, Pull Request"
echo ""
echo "🎉 Deployment completed! Your portfolio should be available at:"
echo "   https://${ROUTE_HOST}"

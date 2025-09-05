#!/bin/bash

# Portfolio OpenShift Deployment Script
# Usage: ./deploy.sh [project-name]

set -e

PROJECT_NAME=${1:-portfolio}
NAMESPACE=${PROJECT_NAME}

echo "🚀 Starting deployment to OpenShift 4.16..."
echo "📁 Project: ${PROJECT_NAME}"
echo "📍 Namespace: ${NAMESPACE}"

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
    oc new-project ${NAMESPACE} --display-name="Portfolio Application" --description="Personal portfolio website"
fi

# Apply all OpenShift configurations
echo "📋 Applying ImageStream..."
oc apply -f openshift/imagestream.yaml

echo "🔨 Applying BuildConfig..."
oc apply -f openshift/buildconfig.yaml

echo "🚢 Applying Deployment..."
oc apply -f openshift/deployment.yaml

echo "🔌 Applying Service..."
oc apply -f openshift/service.yaml

echo "🌐 Applying Route..."
oc apply -f openshift/route.yaml

# Start a build
echo "🏗️  Starting build..."
oc start-build portfolio-build --follow

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
oc rollout status deployment/portfolio --timeout=300s

# Get the application URL
ROUTE_URL=$(oc get route portfolio -o jsonpath='{.spec.host}')
if [ ! -z "$ROUTE_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Application URL: https://${ROUTE_URL}"
else
    echo "⚠️  Deployment completed but route URL not found"
fi

echo ""
echo "📊 Deployment Status:"
echo "   Pods: $(oc get pods -l deployment=portfolio --no-headers | wc -l) running"
echo "   Service: $(oc get svc portfolio --no-headers | awk '{print $3}')"
echo "   Route: ${ROUTE_URL:-'Not found'}"

echo ""
echo "💡 Useful commands:"
echo "   View pods: oc get pods"
echo "   View logs: oc logs -f deployment/portfolio"
echo "   Scale up: oc scale deployment portfolio --replicas=3"
echo "   Delete all: oc delete all -l app=portfolio"

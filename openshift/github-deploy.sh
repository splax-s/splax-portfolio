#!/bin/bash

# Portfolio GitHub-to-OpenShift Deployment Script
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

# Deploy using the appropriate overlay
if [ "$ENVIRONMENT" == "development" ] || [ "$ENVIRONMENT" == "dev" ]; then
    echo "🔧 Deploying development environment..."
    oc apply -k openshift/overlays/development/
elif [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "prod" ]; then
    echo "🏭 Deploying production environment..."
    oc apply -k openshift/overlays/production/
else
    echo "📋 Deploying base configuration..."
    oc apply -k openshift/
fi

# Start a build from GitHub
echo "🏗️  Starting build from GitHub repository..."
BUILD_NAME=$(oc start-build portfolio-build --from-repo=${GITHUB_REPO} --follow --wait)

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully: ${BUILD_NAME}"
else
    echo "❌ Build failed"
    exit 1
fi

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
oc rollout status deployment/portfolio --timeout=300s

# Get the application URL
if [ "$ENVIRONMENT" == "development" ] || [ "$ENVIRONMENT" == "dev" ]; then
    ROUTE_HOST="portfolio-dev.${DOMAIN_SUFFIX}"
elif [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "prod" ]; then
    ROUTE_HOST="portfolio-prod.${DOMAIN_SUFFIX}"
else
    ROUTE_HOST="portfolio.${DOMAIN_SUFFIX}"
fi

echo "✅ Deployment successful!"
echo "🌍 Application URL: https://${ROUTE_HOST}"

# Test the application
echo "🧪 Testing application..."
sleep 10
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
echo "   Pods: $(oc get pods -l deployment=portfolio --no-headers 2>/dev/null | wc -l | tr -d ' ') running"
echo "   Build: $(oc get builds --sort-by=.metadata.creationTimestamp -o name 2>/dev/null | tail -1 | cut -d'/' -f2)"
echo "   Route: ${ROUTE_HOST}"

echo ""
echo "💡 Useful commands:"
echo "   View pods: oc get pods"
echo "   View logs: oc logs -f deployment/portfolio"
echo "   View builds: oc get builds"
echo "   Scale app: oc scale deployment portfolio --replicas=3"
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

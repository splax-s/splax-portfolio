# Portfolio Deployment URLs

## OpenShift Cluster Domain
- Base Domain: `apps.test.mtnn.cloud`
- GitHub Repository: `https://github.com/splax-s/splax-portfolio.git`

## Environment URLs

### Development Environment
- **URL**: https://portfolio-dev.apps.test.mtnn.cloud
- **Namespace**: `portfolio-development`  
- **Replicas**: 1
- **Resources**: 128Mi-256Mi memory, 100m-250m CPU

### Production Environment  
- **URL**: https://portfolio-prod.apps.test.mtnn.cloud
- **Namespace**: `portfolio-production`
- **Replicas**: 3
- **Resources**: 512Mi-1Gi memory, 300m-750m CPU

### Base Environment
- **URL**: https://portfolio.apps.test.mtnn.cloud
- **Namespace**: `portfolio`
- **Replicas**: 1
- **Resources**: 256Mi-512Mi memory, 200m-500m CPU

## Quick Deploy Commands

```bash
# Production deployment (recommended)
./openshift/github-deploy.sh production

# Development deployment
./openshift/github-deploy.sh development

# Base deployment  
./openshift/github-deploy.sh
```

## GitHub Webhook Integration

Once deployed, the build configuration will automatically create builds when you push to GitHub. The webhook URL will be displayed after deployment.

## Monitoring Commands

```bash
# Check application status
oc get pods -l deployment=portfolio

# View logs
oc logs -f deployment/portfolio

# View builds
oc get builds --sort-by=.metadata.creationTimestamp

# Scale application
oc scale deployment portfolio --replicas=5
```

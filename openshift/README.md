# OpenShift 4.16 Deployment Guide

This guide covers deploying the portfolio application to OpenShift 4.16 directly from GitHub.

## Prerequisites

1. **OpenShift CLI (oc)**: Install the OpenShift command-line tool

   ```bash
   # Download from: https://console.redhat.com/openshift/downloads
   # Or install via package manager
   brew install openshift-cli  # macOS
   ```

2. **OpenShift Cluster Access**: Ensure you have access to an OpenShift 4.16 cluster at `*.apps.test.mtnn.cloud`

3. **Login to OpenShift**:

   ```bash
   oc login --token=<your-token> --server=<cluster-url>
   # Or
   oc login -u <username> -p <password> <cluster-url>
   ```

## Quick GitHub Deployment

Use the GitHub deployment script for automated deployment directly from your repository:

```bash
# Deploy production environment
./openshift/github-deploy.sh production

# Deploy development environment  
./openshift/github-deploy.sh development

# Deploy to custom project
./openshift/github-deploy.sh production my-portfolio
```

## Manual Deployment

If you prefer to deploy manually:

1. **Create Project**:

   ```bash
   oc new-project portfolio-prod
   ```

2. **Deploy with Kustomize**:

   ```bash
   # Production deployment
   oc apply -k openshift/overlays/production/
   
   # Development deployment
   oc apply -k openshift/overlays/development/
   ```

3. **Start Build from GitHub**:

   ```bash
   oc start-build portfolio-build --from-repo=https://github.com/splax-s/splax-portfolio.git --follow
   ```

4. **Monitor Deployment**:

   ```bash
   oc rollout status deployment/portfolio
   ```

## OpenShift-Specific Configurations

### Security Context

The application runs with OpenShift's security constraints:
- Non-root user (UID 1001)
- Read-only root filesystem
- Dropped capabilities
- Security Context Constraints (SCC) compliant

### Networking

- Internal port: 8080 (OpenShift standard)
- External access via Route with TLS termination
- Automatic HTTP to HTTPS redirect

### Resource Management

Default resource limits:
- CPU: 200m request, 500m limit
- Memory: 256Mi request, 512Mi limit

## Customization

### Environment Variables

Modify the deployment to add custom environment variables:

```yaml
env:
- name: CUSTOM_VAR
  value: "custom-value"
- name: SECRET_VAR
  valueFrom:
    secretKeyRef:
      name: portfolio-secrets
      key: secret-key
```

### Scaling

Scale the application:
```bash
oc scale deployment portfolio --replicas=3
```

### Custom Domain

Update the route for a custom domain:
```yaml
spec:
  host: portfolio.yourdomain.com
```

## Monitoring

### View Logs
```bash
# All pods
oc logs -f deployment/portfolio

# Specific pod
oc logs -f <pod-name>

# Build logs
oc logs -f bc/portfolio-build
```

### Check Status
```bash
# General status
oc status

# Pods
oc get pods

# Services
oc get svc

# Routes
oc get routes

# Detailed pod info
oc describe pod <pod-name>
```

### Health Checks

The deployment includes:
- **Liveness Probe**: HTTP GET / on port 8080 (every 10s after 30s)
- **Readiness Probe**: HTTP GET / on port 8080 (every 10s after 10s)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   oc logs -f bc/portfolio-build
   ```

2. **Pod Not Starting**:
   ```bash
   oc describe pod <pod-name>
   oc logs <pod-name>
   ```

3. **Route Not Accessible**:
   ```bash
   oc get routes
   curl -I https://$(oc get route portfolio -o jsonpath='{.spec.host}')
   ```

### Security Context Issues

If you encounter permission issues, check the Security Context Constraints:
```bash
oc get scc
oc describe scc restricted-v2
```

## CI/CD Integration

### Webhook Setup

The BuildConfig includes a GitHub webhook trigger. Configure in your GitHub repository:
1. Go to Settings > Webhooks
2. Add webhook URL: `https://<cluster-url>/apis/build.openshift.io/v1/namespaces/<namespace>/buildconfigs/portfolio-build/webhooks/<secret>/github`
3. Content type: `application/json`
4. Events: `Push` and `Pull request`

### Automatic Deployments

Builds are triggered automatically on:
- Source code changes (GitHub webhook)
- Base image updates
- BuildConfig changes

## Cleanup

Remove all resources:
```bash
oc delete all -l app=portfolio
oc delete project portfolio  # If you want to delete the entire project
```

## Additional Resources

- [OpenShift Documentation](https://docs.openshift.com/container-platform/4.16/)
- [Next.js on OpenShift](https://developers.redhat.com/articles/2021/09/21/deploy-nextjs-app-red-hat-openshift)
- [OpenShift S2I Node.js](https://github.com/sclorg/s2i-nodejs-container)

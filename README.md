# pm

A web-based project management system. 

*(Some dependencies may contain vulnerabilities, so this app should not be deployed to open networks until these are updated. Note this repository contains no sensitive content.)*

### Getting started (only need to do this once)

In the project directory, run:

```
cp -n private/migration/.opms_exceptions.json private/migration/opms_exceptions.json
npm install
```

### To start server
```
meteor
```

Server will then be running on localhost:3000

### Development notes

ProjectMilestones collection - not used for now, but could be used instead of storing milestones in ProjectActions collection. Would make reordering actions more complicated.

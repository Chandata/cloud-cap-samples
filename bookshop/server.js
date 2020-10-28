const cds = require ('@sap/cds/lib')
let swaggerDocs={}
let app, host

if (cds.compile.to.openapi) { // check if exporter is available
  const swaggerUi = require ('swagger-ui-express')
  cds.on ('bootstrap', _app => { app = _app })
  cds.on ('serving', service => {
    const apiPath = '/api-docs'+service.path
    console.log (`[Open API] - serving ${service.name} at ${apiPath}`)
    app.use(apiPath, (req, _, next) => {
      req.swaggerDoc = _2swgr(service)
      next()
    }, swaggerUi.serve, swaggerUi.setup())
  })
  cds.on ('listening', ({server})=> { host = 'localhost:'+server.address().port })
}

function _2swgr(service) {
  return swaggerDocs[service.name] = swaggerDocs[service.name] ||
    cds.compile.to.openapi (service.model, {
      service: service.name,
      scheme: 'http', host, basePath: service.path
    })
}

module.exports = cds.server

# YOGA server

* Start server
```
npm start
npm run dev - stating server for development
```

* Required env variables - if not set default values will be used


Name | Default | Description
--- | --- | ---
ENV | dev | environment: dev/prod
DB_USERNAME | null | database username
DB_PASSWORD | null | database password
MAIL_USER | null | mail service user. (only gmail supported). For example jan.kowalski@gmail.com
MAIL_PASSWORD | null | mail service password
MAIL_TO | null | where all mails will be sent from mail service
KARMA_USER | admin | username for protected routes
KARMA_PASSWORD | admin | password for karma user
JWT_SECRET | ghdj456 | jwt secret

* Https

On production server runs with https protocol. You need to add 2 files in order to run server:
Put key as cert.key and cert as cert.crt to certs directory:

* Routes

```
    // AUTHENTICATION
    
    POST /api/auth/login - send user and password in order to get jwt token. For each request with * send token in header 'token' to authorize

    // PORTALS

    GET /api/portals
        HTTP_200 - list of portals
        
    GET /api/portals/:id
        HTTP_200 - portal
        
    *POST /api/portals
        HTTP_201 - portal created succesfully
        HTTP_400 - validation errors
        HTTP_409 - portal with 'name' already exists
        HTTP_401 - unauthorized

    *POST /api/portals/:portal_id
        HTTP_200 - portal updated
        HTTP_401 - unauthorized
        
    *DELETE /api/portals/:portal_id
        HTTP_200 - portal deleted    
        HTTP_401 - unauthorized
        
    // SECTIONS      
        
    GET /api/sections
        HTTP_200 - list of sections    
        
    GET /api/sections/:id
        HTTP_200 - section      
        
    *POST /api/sections
        HTTP_201 - section created succesfully
        HTTP_400 - validation errors
        HTTP_409 - section with 'name' already exists
        HTTP_401 - unauthorized
 
    *POST /api/sections/:section_id
        HTTP_200 - section updated
        HTTP_401 - unauthorized
     
    *DELETE /api/sections/:section_id
        HTTP_200 - section deleted
        HTTP_401 - unauthorized       
        
    // CONTENT ITEMS  
              
    GET /api/content_items
        HTTP_200 - list of content items              

    GET /api/content_items/:id
        HTTP_200 - content item

    GET /api/content_items/tags
        HTTP_200 - get all tags with count       
              
    *POST /api/content_items
        HTTP_201 - content item created succesfully
        HTTP_400 - validation errors
        HTTP_401 - unauthorized

    *POST /api/content_items/:content_item_id
        HTTP_200 - content item updated
        HTTP_401 - unauthorized
        
    *DELETE /api/content_items/:content_item_id
        HTTP_200 - content item deleted
        HTTP_401 - unauthorized           
        
    // SERVICES
    
    POST /api/service/email
        HTTP_200 - email sent
        HTTP_400 - validation errors
        
    // SERVER LOGS
    
    *GET /api/logs    
    
    // VALIDATE TOKEN
    
    *GET /api/validate_token   
    
    // GET IMAGES
    *GET /api/images    
           
```

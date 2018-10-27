# YOGA server

* Start server
```
npm start
```

* Required env variables

```
ENV - [prod,dev]
DB_USERNAME
DB_PASSWORD
MAIL_USER - mail username (client for sending emails for example jan.nowak@gmail.com)
MAIL_PASSWORD 
MAIL_TO - email address where correspondation will be send
KARMA_USER - username for authorized routes
KARMA_PASSWORD - password for authorized routes
```

* Routes

```
    // PORTALS

    GET /api/portals
        HTTP_200 - list of portals
        
    POST /api/portals
        HTTP_201 - portal created succesfully
        HTTP_400 - validation errors
        HTTP_409 - portal with 'name' already exists
        HTTP_401 - unauthorized

    POST /api/portals/:portal_id
        HTTP_200 - portal updated
        HTTP_401 - unauthorized
        
    DELETE /api/portals/:portal_id
        HTTP_200 - portal deleted    
        HTTP_401 - unauthorized
        
    // SECTIONS      
        
    GET /api/sections
        HTTP_200 - list of sections    
        
    POST /api/sections
        HTTP_201 - section created succesfully
        HTTP_400 - validation errors
        HTTP_409 - section with 'name' already exists
        HTTP_401 - unauthorized
 
    POST /api/sections/:section_id
        HTTP_200 - section updated
        HTTP_401 - unauthorized
     
    DELETE /api/sections/:section_id
        HTTP_200 - section deleted
        HTTP_401 - unauthorized       
        
    // CONTENT ITEMS  
              
    GET /api/content_items
        HTTP_200 - list of content items              
              
    POST /api/content_items
        HTTP_201 - content item created succesfully
        HTTP_400 - validation errors
        HTTP_401 - unauthorized

    POST /api/content_items/:content_item_id
        HTTP_200 - content item updated
        HTTP_401 - unauthorized
        
    DELETE /api/content_items/:content_item_id
        HTTP_200 - content item deleted
        HTTP_401 - unauthorized           
        
    // SERVICES
    
    POST /api/service/email
        HTTP_200 - email sent
        HTTP_400 - validation errors
        
    // SERVER LOGS
    
    GET /api/logs    
           
```

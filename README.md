# YOGA server

* Start server
```
npm start
```

* Env variables

```
ENV - [prod,dev]
DB_USERNAME
DB_PASSWORD
```

* Routes

```java
    GET /api/portals
        HTTP_200 - list of portals
        
    POST /api/portals
        HTTP_201 - portal created succesfully
        HTTP_400 - validation errors
        HTTP_409 - portal with 'name' already exists
        
    POST /api/portals/:portalId/sections/:sectionId
        HTTP_200 - section added to portal
        HTTP_404 - portal does not exists 
        
    DELETE /api/portals/:portalId/sections/:sectionId
        HTTP_200 - section removed from portal  
        HTTP_404 - portal does not exists        
        
    GET /api/sections
        HTTP_200 - list of sections    
        
    POST /api/sections
        HTTP_201 - section created succesfully
        HTTP_400 - validation errors
        HTTP_409 - section with 'name' already exists
        
    DELETE /api/sections/:sectionId
        HTTP_200 - section_removed
        HTTP_404 - section does not exist         
           
```
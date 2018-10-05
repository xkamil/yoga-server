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

```
    GET /api/portals
        HTTP_200 - list of portals
        
    POST /api/portals
        HTTP_201 - portal created succesfully
        HTTP_400 - validation errors
        HTTP_409 - portal with 'name' already exists
        
    DELETE /api/portals/:portal_id
        HTTP_200 - portal deleted    
        
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
     
    DELETE /api/sections/:section_id
        HTTP_200 - section deleted       
        
    POST /api/sections/:sectionId/content_items/:content_item_id
        HTTP_200 - content item added to section
        HTTP_404 - section does not exists       
        
    DELETE /api/sections/:sectionId/content_items/:content_item_id
        HTTP_200 - content item removed from section
        HTTP_404 - section does not exists          
        
    POST /api/content_items
        HTTP_201 - content item created succesfully
        HTTP_400 - validation errors

    GET /api/content_items
        HTTP_200 - list of content items
        
    DELETE /api/content_items/:content_item_id
        HTTP_200 - content item deleted                  
```
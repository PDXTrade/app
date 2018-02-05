# TradePXD

**Classes and Methods**

App
  - setPage
  - render
  - unrender
  
Header
  - render
  
Home
  - render
  - unrender
  
ItemList
  - render
    - child added / removed /changed listeners
  - unrender
  
Item
  - constructor
    - key, object, images
  - update
  - render
  - unrender
  
ItemDetail
  - isOwner
  - handleSubmit
  - render
    - onvalue, images
  - unrender
  
newItem
  - constructor
    - onAdd
  - handleSubmit
  - render
  - unrender
  
Images
  - constructor
    - itemimages, itemimagestorage
  - handleUpload
  - handleRemove
  - render
    - child added / removed listeners
  - unrender
  
Image
  - constructor
    - src, onremove
  - render  
    - getCloudinaryUrl, options

User
  - locationEdit
  - render
  - unrender

Offer 
  - constructor
    - user1, user2, user1items, user2items
  - update
  - render
  - unrender

offerList
  - render
    - child added / removed /changed listeners
  - unrender

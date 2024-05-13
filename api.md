<!-- Items  -->

/api/v1/item/post
/api/v1/item/get
/api/v1/item/update/:itemId
/api/v1/item/delete/:itemId

<!-- Carts  -->

/api/v1/cart/post
/api/v1/cart/get/:userId
/api/v1/cart/stats
/api/v1/cart/delete/:cartId
/api/v1/cart/update/increase/:cartId
/api/v1/cart/update/decrease/:cartId

<!-- wishlist -->

/api/v1/wishlist/post
/api/v1/wishlist/get/:userId
/api/v1/wishlist/stats
/api/v1/wishlist/delete/:wishlistId

<!-- Order -->

/api/v1/order/post
/api/v1/order/stats
/api/v1/order/get/:userId
/api/v1/order/get/admin
/api/v1/order/update/:orderId
/api/v1/order/get/:status

<!-- User -->

/api/v1/user/stats
/api/v1/user/get/:id
/api/v1/user/update/:id

<!-- Pending Order -->

/api/v1/pendingOrder/post
/api/v1/pendingOrder/stats
/api/v1/pendingOrder/delete/:pendingOrderId
/api/v1/pendingOrder/get/:userId

<!-- Products -->

/api/v1/product/post
/api/v1/product/stats
/api/v1/product/get
/api/v1/product/get/:slug
/api/v1/product/getid/:id
/api/v1/product/get/admin
/api/v1/product/get/allProduct // related products
/api/v1/product/delete/:id
/api/v1/product/deleteImage
/api/v1/product/put/:id
/api/v1/product/put/slider/:id

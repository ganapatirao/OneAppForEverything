using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace BusinessPlatform.API.Models

{

    public class Category

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("description")]

        public string Description { get; set; } = string.Empty;



        [BsonElement("imageUrl")]

        public string ImageUrl { get; set; } = string.Empty;



        [BsonElement("status")]

        public string Status { get; set; } = "Active";



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }



    public class Product

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("description")]

        public string Description { get; set; } = string.Empty;



        [BsonElement("price")]

        public decimal Price { get; set; }



        [BsonElement("categoryId")]

        public string? CategoryId { get; set; }



        [BsonElement("categoryName")]

        public string CategoryName { get; set; } = string.Empty;



        [BsonElement("stock")]

        public int Stock { get; set; }



        [BsonElement("seller")]

        public string Seller { get; set; } = string.Empty;



        [BsonElement("rating")]

        public double Rating { get; set; }



        [BsonElement("reviewCount")]

        public int ReviewCount { get; set; }



        [BsonElement("imageUrl")]

        public string ImageUrl { get; set; } = string.Empty;



        [BsonElement("imageUrls")]

        public List<string> ImageUrls { get; set; } = new List<string>();



        [BsonElement("status")]

        public string Status { get; set; } = "Active";



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        [BsonElement("pros")]

        public List<string> Pros { get; set; } = new List<string>();



        [BsonElement("cons")]

        public List<string> Cons { get; set; } = new List<string>();

        [BsonElement("reviews")]

        public List<ProductReview> Reviews { get; set; } = new List<ProductReview>();

    }



    public class ProductReview

    {

        [BsonElement("userName")]

        public string UserName { get; set; } = string.Empty;



        [BsonElement("rating")]

        public int Rating { get; set; }



        [BsonElement("title")]

        public string Title { get; set; } = string.Empty;



        [BsonElement("comment")]

        public string Comment { get; set; } = string.Empty;



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }



    public class ShoppingCartItem

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("userId")]

        public string? UserId { get; set; }



        [BsonElement("productId")]

        public string? ProductId { get; set; }



        [BsonElement("quantity")]

        public int Quantity { get; set; }



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }



    public class OrderItem

    {

        [BsonElement("productId")]

        public string? ProductId { get; set; }



        [BsonElement("productName")]

        public string ProductName { get; set; } = string.Empty;



        [BsonElement("quantity")]

        public int Quantity { get; set; }



        [BsonElement("price")]

        public decimal Price { get; set; }

    }



    public class ShoppingOrder

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("userId")]

        public string? UserId { get; set; }



        [BsonElement("userName")]

        public string UserName { get; set; } = string.Empty;



        [BsonElement("userEmail")]

        public string UserEmail { get; set; } = string.Empty;



        [BsonElement("userPhone")]

        public string UserPhone { get; set; } = string.Empty;



        [BsonElement("items")]

        public List<OrderItem> Items { get; set; } = new List<OrderItem>();



        [BsonElement("total")]

        public decimal Total { get; set; }



        [BsonElement("status")]

        public string Status { get; set; } = "Confirmed";



        [BsonElement("shippingAddress")]

        public string ShippingAddress { get; set; } = string.Empty;



        [BsonElement("billingAddress")]

        public string BillingAddress { get; set; } = string.Empty;



        [BsonElement("paymentMethod")]

        public string PaymentMethod { get; set; } = string.Empty;



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }



    public class State

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("code")]

        public string Code { get; set; } = string.Empty;

    }



    public class District

    {

        [BsonId]

        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("stateCode")]

        public string StateCode { get; set; } = string.Empty;

    }

}


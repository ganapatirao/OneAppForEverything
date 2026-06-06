using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BusinessPlatform.API.Models
{
    public class AdCategory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("emoji")]
        public string Emoji { get; set; } = string.Empty;

        [BsonElement("subcategories")]
        public List<string> Subcategories { get; set; } = new List<string>();

        [BsonElement("status")]
        public string Status { get; set; } = "Active";

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Advertisement
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("categoryId")]
        public string? CategoryId { get; set; }

        [BsonElement("categoryName")]
        public string CategoryName { get; set; } = string.Empty;

        [BsonElement("subcategory")]
        public string Subcategory { get; set; } = string.Empty;

        [BsonElement("location")]
        public string Location { get; set; } = string.Empty;

        [BsonElement("city")]
        public string City { get; set; } = string.Empty;

        [BsonElement("condition")]
        public string Condition { get; set; } = string.Empty;

        [BsonElement("sellerId")]
        public string? SellerId { get; set; }

        [BsonElement("sellerName")]
        public string SellerName { get; set; } = string.Empty;

        [BsonElement("sellerPhone")]
        public string SellerPhone { get; set; } = string.Empty;

        [BsonElement("phoneDisplayStatus")]
        public string PhoneDisplayStatus { get; set; } = "Visible";

        [BsonElement("sellerEmail")]
        public string SellerEmail { get; set; } = string.Empty;

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = string.Empty;

        [BsonElement("imageUrls")]
        public List<string> ImageUrls { get; set; } = new List<string>();

        [BsonElement("negotiable")]
        public bool Negotiable { get; set; } = false;

        [BsonElement("isFeatured")]
        public bool IsFeatured { get; set; } = false;

        [BsonElement("isUrgent")]
        public bool IsUrgent { get; set; } = false;

        [BsonElement("views")]
        public int Views { get; set; } = 0;

        [BsonElement("status")]
        public string Status { get; set; } = "Active";

        [BsonElement("postedDate")]
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AdResponse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("adId")]
        public string? AdId { get; set; }

        [BsonElement("responderId")]
        public string? ResponderId { get; set; }

        [BsonElement("responderName")]
        public string ResponderName { get; set; } = string.Empty;

        [BsonElement("responderEmail")]
        public string ResponderEmail { get; set; } = string.Empty;

        [BsonElement("responderPhone")]
        public string ResponderPhone { get; set; } = string.Empty;

        [BsonElement("message")]
        public string Message { get; set; } = string.Empty;

        [BsonElement("isRead")]
        public bool IsRead { get; set; } = false;

        [BsonElement("status")]
        public string Status { get; set; } = "Pending";

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Agent
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public string? UserId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("companyName")]
        public string CompanyName { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("specialization")]
        public List<string> Specialization { get; set; } = new List<string>();

        [BsonElement("verified")]
        public bool Verified { get; set; } = false;

        [BsonElement("rating")]
        public double Rating { get; set; } = 0;

        [BsonElement("totalAds")]
        public int TotalAds { get; set; } = 0;

        [BsonElement("activeAds")]
        public int ActiveAds { get; set; } = 0;

        [BsonElement("status")]
        public string Status { get; set; } = "Active";

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

using BusinessPlatform.API.Models;
using BusinessPlatform.API.Services;
using MongoDB.Driver;

namespace BusinessPlatform.API.Seed
{
    public class ShoppingSeedData
    {
        private readonly MongoDbContext _context;

        public ShoppingSeedData(MongoDbContext context)
        {
            _context = context;
        }

        private string GenerateSvgDataUrl(string color, string text = "")
        {
            var svg = $"<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='{color}'/><text x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'>{text}</text></svg>";
            var bytes = System.Text.Encoding.UTF8.GetBytes(svg);
            var base64 = Convert.ToBase64String(bytes);
            return $"data:image/svg+xml;base64,{base64}";
        }

        public async Task SeedAsync()
        {
            await _context.Categories.DeleteManyAsync(_ => true);
            await _context.Products.DeleteManyAsync(_ => true);
            await _context.ShoppingCartItems.DeleteManyAsync(_ => true);
            await _context.ShoppingOrders.DeleteManyAsync(_ => true);

            // Seed Categories
            var categories = new[]
            {
                new Category { Name = "Electronics", Description = "Electronic devices and gadgets", ImageUrl = GenerateSvgDataUrl("#3B82F6", "Electronics"), DisplaySequence = 1 },
                new Category { Name = "Clothing", Description = "Fashion and apparel", ImageUrl = GenerateSvgDataUrl("#EC4899", "Clothing"), DisplaySequence = 2 },
                new Category { Name = "Books", Description = "Books and educational materials", ImageUrl = GenerateSvgDataUrl("#8B5CF6", "Books"), DisplaySequence = 3 },
                new Category { Name = "Home & Kitchen", Description = "Home appliances and kitchen items", ImageUrl = GenerateSvgDataUrl("#F59E0B", "Home & Kitchen"), DisplaySequence = 4 },
                new Category { Name = "Sports", Description = "Sports equipment and accessories", ImageUrl = GenerateSvgDataUrl("#10B981", "Sports"), DisplaySequence = 5 }
            };
            await _context.Categories.InsertManyAsync(categories);

            // Seed Products
            var products = new[]
            {
                new Product {
                    Name = "Wireless Bluetooth Headphones",
                    Description = "Experience premium audio quality with these state-of-the-art wireless Bluetooth headphones featuring advanced noise cancellation technology. Designed for audiophiles and music enthusiasts, these headphones deliver crystal-clear sound with deep bass and crisp highs. The 30-hour battery life ensures you can enjoy your music all day without interruption. Perfect for commuting, working out, or relaxing at home.",
                    Price = 12499m,
                    CategoryName = "Electronics",
                    Stock = 50,
                    Seller = "John Smith",
                    Rating = 4.5,
                    DisplaySequence = 1,
                    ImageUrl = GenerateSvgDataUrl("#3B82F6", "Headphones"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#3B82F6", "Headphones 1"),
                        GenerateSvgDataUrl("#60A5FA", "Headphones 2"),
                        GenerateSvgDataUrl("#93C5FD", "Headphones 3")
                    },
                    Pros = new List<string> { "30-hour battery life", "Active noise cancellation", "Comfortable over-ear design", "Bluetooth 5.0 connectivity", "Foldable for easy storage" },
                    Cons = new List<string> { "Slightly heavy", "Charging cable is short", "Not water-resistant" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Amit Sharma", Rating = 5, Title = "Excellent sound quality", Comment = "The sound is clear, bass is strong, and noise cancellation works really well during travel.", CreatedAt = DateTime.UtcNow.AddDays(-18) },
                        new ProductReview { UserName = "Priya Nair", Rating = 4, Title = "Comfortable for long use", Comment = "Very comfortable headphones with great battery backup. The only issue is that it feels slightly heavy after many hours.", CreatedAt = DateTime.UtcNow.AddDays(-9) },
                        new ProductReview { UserName = "Rahul Verma", Rating = 5, Title = "Worth the price", Comment = "Premium build and reliable Bluetooth connectivity. I use it daily for meetings and music.", CreatedAt = DateTime.UtcNow.AddDays(-3) }
                    }
                },
                new Product {
                    Name = "Smart Watch Series 5",
                    Description = "Stay connected and track your health with this advanced smartwatch featuring comprehensive health monitoring, built-in GPS, and water resistance up to 50 meters. Monitor your heart rate, sleep patterns, and daily activities with precision. The vibrant AMOLED display is always visible, and with 7-day battery life, you can go a week without charging. Compatible with both iOS and Android devices.",
                    Price = 24999m,
                    CategoryName = "Electronics",
                    Stock = 30,
                    Seller = "John Smith",
                    Rating = 4.8,
                    DisplaySequence = 2,
                    ImageUrl = GenerateSvgDataUrl("#10B981", "Smart Watch"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#10B981", "Smart Watch 1"),
                        GenerateSvgDataUrl("#34D399", "Smart Watch 2"),
                        GenerateSvgDataUrl("#6EE7B7", "Smart Watch 3")
                    },
                    Pros = new List<string> { "7-day battery life", "Water-resistant to 50m", "Built-in GPS", "Health monitoring features", "Always-on display" },
                    Cons = new List<string> { "Expensive", "Limited app ecosystem", "Charging is slow" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Sneha Reddy", Rating = 5, Title = "Perfect fitness companion", Comment = "Health tracking is accurate, GPS works well, and the battery easily lasts several days.", CreatedAt = DateTime.UtcNow.AddDays(-15) },
                        new ProductReview { UserName = "Karan Mehta", Rating = 4, Title = "Great display", Comment = "The AMOLED display looks premium and is easy to read outdoors. App support could be better.", CreatedAt = DateTime.UtcNow.AddDays(-7) },
                        new ProductReview { UserName = "Divya Iyer", Rating = 5, Title = "Very useful daily", Comment = "Notifications, workout tracking, and sleep tracking are all very useful. Happy with the purchase.", CreatedAt = DateTime.UtcNow.AddDays(-2) }
                    }
                },
                new Product {
                    Name = "Premium Cotton T-Shirt",
                    Description = "Crafted from 100% organic cotton, this premium t-shirt offers unparalleled comfort and durability. The breathable fabric keeps you cool in summer and warm in winter. Pre-shrunk to maintain its fit wash after wash. Available in multiple colors to suit your style. Perfect for casual wear, gym sessions, or as a base layer.",
                    Price = 2499m,
                    CategoryName = "Clothing",
                    Stock = 200,
                    Seller = "Jane Doe",
                    Rating = 4.2,
                    DisplaySequence = 3,
                    ImageUrl = GenerateSvgDataUrl("#EC4899", "T-Shirt"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#EC4899", "T-Shirt 1"),
                        GenerateSvgDataUrl("#F472B6", "T-Shirt 2"),
                        GenerateSvgDataUrl("#FBCFE8", "T-Shirt 3")
                    },
                    Pros = new List<string> { "100% organic cotton", "Pre-shrunk", "Breathable fabric", "Multiple colors available", "Durable stitching" },
                    Cons = new List<string> { "Limited size range", "Slightly expensive", "Needs careful washing" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Rohit Kulkarni", Rating = 4, Title = "Soft and breathable", Comment = "The cotton quality is very good and feels comfortable in hot weather.", CreatedAt = DateTime.UtcNow.AddDays(-22) },
                        new ProductReview { UserName = "Ananya Das", Rating = 5, Title = "Excellent fabric", Comment = "Fabric feels premium and stitching is neat. It retained shape after washing.", CreatedAt = DateTime.UtcNow.AddDays(-11) },
                        new ProductReview { UserName = "Vikram Singh", Rating = 4, Title = "Good casual wear", Comment = "Good fit and nice color. Slightly costly but quality is better than regular t-shirts.", CreatedAt = DateTime.UtcNow.AddDays(-5) }
                    }
                },
                new Product {
                    Name = "Running Shoes Pro",
                    Description = "Engineered for serious runners, these professional running shoes feature advanced cushioning technology that absorbs impact and provides energy return. The lightweight mesh upper ensures breathability, while the durable rubber outsole offers excellent traction on various surfaces. Ideal for marathon training, daily running, or gym workouts.",
                    Price = 10999m,
                    CategoryName = "Sports",
                    Stock = 75,
                    Seller = "Bob Wilson",
                    Rating = 4.6,
                    DisplaySequence = 4,
                    ImageUrl = GenerateSvgDataUrl("#10B981", "Running Shoes"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#10B981", "Running Shoes 1"),
                        GenerateSvgDataUrl("#34D399", "Running Shoes 2"),
                        GenerateSvgDataUrl("#6EE7B7", "Running Shoes 3")
                    },
                    Pros = new List<string> { "Advanced cushioning", "Lightweight design", "Excellent traction", "Breathable mesh upper", "Energy return technology" },
                    Cons = new List<string> { "Narrow fit", "Not suitable for wide feet", "Higher price point" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Nitin Rao", Rating = 5, Title = "Great cushioning", Comment = "Very comfortable for running. Cushioning reduces knee impact during long runs.", CreatedAt = DateTime.UtcNow.AddDays(-19) },
                        new ProductReview { UserName = "Meera Joshi", Rating = 4, Title = "Lightweight shoes", Comment = "Shoes are light and breathable. Fit is slightly narrow, so check size before buying.", CreatedAt = DateTime.UtcNow.AddDays(-8) },
                        new ProductReview { UserName = "Arjun Patel", Rating = 5, Title = "Excellent grip", Comment = "Grip is strong on road and treadmill. Good choice for regular runners.", CreatedAt = DateTime.UtcNow.AddDays(-4) }
                    }
                },
                new Product {
                    Name = "Programming Guide: C#",
                    Description = "Master C# programming with this comprehensive guide covering everything from basics to advanced concepts. Perfect for beginners starting their coding journey and experienced developers looking to enhance their skills. Includes real-world examples, best practices, and industry-standard patterns. Learn to build robust applications with .NET framework.",
                    Price = 4199m,
                    CategoryName = "Books",
                    Stock = 100,
                    Seller = "Alice Brown",
                    Rating = 4.7,
                    DisplaySequence = 5,
                    ImageUrl = GenerateSvgDataUrl("#8B5CF6", "C# Book"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#8B5CF6", "C# Book 1"),
                        GenerateSvgDataUrl("#A78BFA", "C# Book 2"),
                        GenerateSvgDataUrl("#C4B5FD", "C# Book 3")
                    },
                    Pros = new List<string> { "Comprehensive coverage", "Real-world examples", "Best practices included", "Suitable for all levels", "Industry-standard patterns" },
                    Cons = new List<string> { "Heavy book", "Requires prior programming knowledge", "Some examples are outdated" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Suresh Kumar", Rating = 5, Title = "Very detailed guide", Comment = "Concepts are explained clearly with examples. Useful for beginners and intermediate developers.", CreatedAt = DateTime.UtcNow.AddDays(-30) },
                        new ProductReview { UserName = "Neha Gupta", Rating = 4, Title = "Good reference book", Comment = "Great as a reference book. Some sections need prior programming knowledge.", CreatedAt = DateTime.UtcNow.AddDays(-14) },
                        new ProductReview { UserName = "Manoj B", Rating = 5, Title = "Helpful examples", Comment = "Real-world examples helped me understand C# better. Recommended for learners.", CreatedAt = DateTime.UtcNow.AddDays(-6) }
                    }
                },
                new Product {
                    Name = "4K Smart TV 55 inch",
                    Description = "Transform your entertainment experience with this stunning 55-inch 4K Ultra HD smart TV. Featuring Dolby Vision HDR and Dolby Atmos for immersive audio. Built-in streaming apps give you access to Netflix, Prime Video, Disney+, and more. Voice control with Google Assistant makes navigation effortless. Perfect for movie nights, gaming, and sports.",
                    Price = 49999m,
                    CategoryName = "Electronics",
                    Stock = 25,
                    Seller = "John Smith",
                    Rating = 4.4,
                    DisplaySequence = 6,
                    ImageUrl = GenerateSvgDataUrl("#3B82F6", "Smart TV"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#3B82F6", "Smart TV 1"),
                        GenerateSvgDataUrl("#60A5FA", "Smart TV 2"),
                        GenerateSvgDataUrl("#93C5FD", "Smart TV 3")
                    },
                    Pros = new List<string> { "4K Ultra HD resolution", "Dolby Vision HDR", "Built-in streaming apps", "Voice control", "Multiple HDMI ports" },
                    Cons = new List<string> { "Premium pricing", "Remote could be better", "No built-in camera" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Akash Jain", Rating = 5, Title = "Amazing picture quality", Comment = "4K picture is sharp and colors are vibrant. Movies look fantastic on this TV.", CreatedAt = DateTime.UtcNow.AddDays(-17) },
                        new ProductReview { UserName = "Pooja Menon", Rating = 4, Title = "Good smart TV", Comment = "Apps work smoothly and sound quality is good. Remote design could have been better.", CreatedAt = DateTime.UtcNow.AddDays(-10) },
                        new ProductReview { UserName = "Hari Prasad", Rating = 4, Title = "Great for family use", Comment = "Excellent screen size and features for the living room. Setup was easy.", CreatedAt = DateTime.UtcNow.AddDays(-1) }
                    }
                },
                new Product {
                    Name = "Coffee Maker Deluxe",
                    Description = "Wake up to the perfect cup of coffee with this programmable coffee maker featuring a built-in conical burr grinder and thermal carafe. Grind fresh beans for maximum flavor and aroma. The 24-hour programmable timer lets you wake up to freshly brewed coffee. The thermal carafe keeps coffee hot for hours without burning. Easy to clean and maintain.",
                    Price = 7499m,
                    CategoryName = "Home & Kitchen",
                    Stock = 60,
                    Seller = "Jane Doe",
                    Rating = 4.3,
                    DisplaySequence = 7,
                    ImageUrl = GenerateSvgDataUrl("#F59E0B", "Coffee Maker"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#F59E0B", "Coffee Maker 1"),
                        GenerateSvgDataUrl("#FBBF24", "Coffee Maker 2"),
                        GenerateSvgDataUrl("#FCD34D", "Coffee Maker 3")
                    },
                    Pros = new List<string> { "Built-in grinder", "Thermal carafe", "Programmable timer", "Easy to clean", "Consistent brewing" },
                    Cons = new List<string> { "Large footprint", "Noisy grinder", "Expensive" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Lavanya S", Rating = 5, Title = "Fresh coffee every morning", Comment = "The grinder gives a fresh aroma and programmable timer is very convenient.", CreatedAt = DateTime.UtcNow.AddDays(-21) },
                        new ProductReview { UserName = "Ramesh N", Rating = 4, Title = "Good but large", Comment = "Coffee taste is excellent, but the machine takes more kitchen counter space.", CreatedAt = DateTime.UtcNow.AddDays(-12) },
                        new ProductReview { UserName = "Isha Kapoor", Rating = 4, Title = "Reliable machine", Comment = "Consistent brewing and easy cleaning. Grinder noise is acceptable.", CreatedAt = DateTime.UtcNow.AddDays(-4) }
                    }
                },
                new Product {
                    Name = "Yoga Mat Premium",
                    Description = "Practice yoga in comfort and style with this extra-thick premium yoga mat. The non-slip surface ensures stability during challenging poses, while the cushioned padding protects your joints. Includes a convenient carrying strap for easy transport. Eco-friendly materials make it safe for you and the environment. Perfect for home practice, studio classes, or outdoor sessions.",
                    Price = 3499m,
                    CategoryName = "Sports",
                    Stock = 150,
                    Seller = "Bob Wilson",
                    Rating = 4.5,
                    DisplaySequence = 8,
                    ImageUrl = GenerateSvgDataUrl("#10B981", "Yoga Mat"),
                    ImageUrls = new List<string> {
                        GenerateSvgDataUrl("#10B981", "Yoga Mat 1"),
                        GenerateSvgDataUrl("#34D399", "Yoga Mat 2"),
                        GenerateSvgDataUrl("#6EE7B7", "Yoga Mat 3")
                    },
                    Pros = new List<string> { "Extra-thick padding", "Non-slip surface", "Eco-friendly materials", "Includes carrying strap", "Joint protection" },
                    Cons = new List<string> { "Heavy to carry", "Limited color options", "Slightly expensive" },
                    Reviews = new List<ProductReview> {
                        new ProductReview { UserName = "Swati Mishra", Rating = 5, Title = "Comfortable yoga mat", Comment = "Padding is excellent and helps during floor exercises. Non-slip grip is very good.", CreatedAt = DateTime.UtcNow.AddDays(-16) },
                        new ProductReview { UserName = "Deepak S", Rating = 4, Title = "Good quality", Comment = "Mat feels durable and comfortable. It is slightly heavy to carry daily.", CreatedAt = DateTime.UtcNow.AddDays(-7) },
                        new ProductReview { UserName = "Kavya Rao", Rating = 5, Title = "Perfect for home workouts", Comment = "Great for yoga and stretching at home. The carrying strap is useful.", CreatedAt = DateTime.UtcNow.AddDays(-2) }
                    }
                }
            };
            await _context.Products.InsertManyAsync(products);

            // Seed Shopping Orders
            var orders = new[]
            {
                new ShoppingOrder { UserId = "user1", UserName = "John Smith", Items = new List<OrderItem> { new OrderItem { ProductId = products[0].Id, ProductName = products[0].Name, Quantity = 2, Price = products[0].Price }, new OrderItem { ProductId = products[2].Id, ProductName = products[2].Name, Quantity = 3, Price = products[2].Price } }, Total = 389.95m, Status = "Delivered", ShippingAddress = "123 Main St, New York, NY", PaymentMethod = "Credit Card" },
                new ShoppingOrder { UserId = "user2", UserName = "Jane Doe", Items = new List<OrderItem> { new OrderItem { ProductId = products[1].Id, ProductName = products[1].Name, Quantity = 1, Price = products[1].Price } }, Total = 299.99m, Status = "Shipped", ShippingAddress = "456 Oak Ave, Los Angeles, CA", PaymentMethod = "PayPal" },
                new ShoppingOrder { UserId = "user3", UserName = "Bob Wilson", Items = new List<OrderItem> { new OrderItem { ProductId = products[3].Id, ProductName = products[3].Name, Quantity = 1, Price = products[3].Price }, new OrderItem { ProductId = products[6].Id, ProductName = products[6].Name, Quantity = 1, Price = products[6].Price } }, Total = 219.98m, Status = "Confirmed", ShippingAddress = "789 Pine Rd, Chicago, IL", PaymentMethod = "Credit Card" }
            };
            await _context.ShoppingOrders.InsertManyAsync(orders);
        }
    }
}

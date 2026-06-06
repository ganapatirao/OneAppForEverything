using BusinessPlatform.API.Models;

using BusinessPlatform.API.Services;

using MongoDB.Driver;

using System.Security.Cryptography;

using System.Text;



namespace BusinessPlatform.API

{

    public class SeedData

    {

        private readonly MongoDbContext _context;



        public SeedData(MongoDbContext context)

        {

            _context = context;

        }



        private string HashPassword(string password)

        {

            using var sha = SHA256.Create();

            var bytes = Encoding.UTF8.GetBytes(password);

            var hash = sha.ComputeHash(bytes);

            return Convert.ToBase64String(hash);

        }



        public async Task SeedAsync()

        {

            // Clear all collections

            await _context.Users.DeleteManyAsync(_ => true);

            await _context.Categories.DeleteManyAsync(_ => true);

            await _context.Products.DeleteManyAsync(_ => true);

            await _context.ShoppingCartItems.DeleteManyAsync(_ => true);

            await _context.ShoppingOrders.DeleteManyAsync(_ => true);

            await _context.AdCategories.DeleteManyAsync(_ => true);

            await _context.Advertisements.DeleteManyAsync(_ => true);

            await _context.AdResponses.DeleteManyAsync(_ => true);

            await _context.Jobs.DeleteManyAsync(_ => true);

            await _context.JobApplications.DeleteManyAsync(_ => true);

            await _context.Candidates.DeleteManyAsync(_ => true);

            await _context.Transports.DeleteManyAsync(_ => true);

            await _context.TravelPackages.DeleteManyAsync(_ => true);

            await _context.Movies.DeleteManyAsync(_ => true);

            await _context.MovieShowtimes.DeleteManyAsync(_ => true);

            await _context.Bookings.DeleteManyAsync(_ => true);

            await _context.States.DeleteManyAsync(_ => true);

            await _context.Districts.DeleteManyAsync(_ => true);



            // Seed Users

            var adminUser = new User

            {

                Username = "admin",

                Email = "admin@businessplatform.com",

                Password = HashPassword("admin123"),

                FullName = "System Administrator",

                Phone = "+1-555-0100",

                Role = "Admin",

                IsActive = true

            };

            await _context.Users.InsertOneAsync(adminUser);



            var user1 = new User

            {

                Username = "johnsmith",

                Email = "john@example.com",

                Password = HashPassword("password123"),

                FullName = "John Smith",

                Phone = "+1-555-0101",

                Role = "User",

                IsActive = true

            };

            await _context.Users.InsertOneAsync(user1);



            var user2 = new User

            {

                Username = "janedoe",

                Email = "jane@example.com",

                Password = HashPassword("password123"),

                FullName = "Jane Doe",

                Phone = "+1-555-0102",

                Role = "User",

                IsActive = true

            };

            await _context.Users.InsertOneAsync(user2);



            var user3 = new User

            {

                Username = "bobwilson",

                Email = "bob@example.com",

                Password = HashPassword("password123"),

                FullName = "Bob Wilson",

                Phone = "+1-555-0103",

                Role = "User",

                IsActive = true

            };

            await _context.Users.InsertOneAsync(user3);



            var user4 = new User

            {

                Username = "alicebrown",

                Email = "alice@example.com",

                Password = HashPassword("password123"),

                FullName = "Alice Brown",

                Phone = "+1-555-0104",

                Role = "User",

                IsActive = true

            };

            await _context.Users.InsertOneAsync(user4);



            // Seed Categories

            var categories = new[]

            {

                new Category { Name = "Electronics", Description = "Electronic devices and gadgets", ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" },

                new Category { Name = "Clothing", Description = "Fashion and apparel", ImageUrl = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" },

                new Category { Name = "Books", Description = "Books and educational materials", ImageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop" },

                new Category { Name = "Home & Kitchen", Description = "Home appliances and kitchen items", ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },

                new Category { Name = "Sports", Description = "Sports equipment and accessories", ImageUrl = "https://images.unsplash.com/photo-1461896836934-voices-of-sports?w=400&h=300&fit=crop" }

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

                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop"
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

                    ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop"
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

                new ShoppingOrder { UserId = user1.Id, UserName = user1.FullName, Items = new List<OrderItem> { new OrderItem { ProductId = products[0].Id, ProductName = products[0].Name, Quantity = 2, Price = products[0].Price }, new OrderItem { ProductId = products[2].Id, ProductName = products[2].Name, Quantity = 3, Price = products[2].Price } }, Total = 389.95m, Status = "Delivered", ShippingAddress = "123 Main St, New York, NY", PaymentMethod = "Credit Card" },

                new ShoppingOrder { UserId = user2.Id, UserName = user2.FullName, Items = new List<OrderItem> { new OrderItem { ProductId = products[1].Id, ProductName = products[1].Name, Quantity = 1, Price = products[1].Price } }, Total = 299.99m, Status = "Shipped", ShippingAddress = "456 Oak Ave, Los Angeles, CA", PaymentMethod = "PayPal" },

                new ShoppingOrder { UserId = user3.Id, UserName = user3.FullName, Items = new List<OrderItem> { new OrderItem { ProductId = products[3].Id, ProductName = products[3].Name, Quantity = 1, Price = products[3].Price }, new OrderItem { ProductId = products[6].Id, ProductName = products[6].Name, Quantity = 1, Price = products[6].Price } }, Total = 219.98m, Status = "Confirmed", ShippingAddress = "789 Pine Rd, Chicago, IL", PaymentMethod = "Credit Card" }

            };

            await _context.ShoppingOrders.InsertManyAsync(orders);



            // Seed Ad Categories

            var adCategories = new[]

            {

                new AdCategory { Name = "Electronics", Emoji = "📱" },

                new AdCategory { Name = "Vehicles", Emoji = "🚗" },

                new AdCategory { Name = "Real Estate", Emoji = "🏠" },

                new AdCategory { Name = "Furniture", Emoji = "🪑" },

                new AdCategory { Name = "Jobs", Emoji = "💼" },

                new AdCategory { Name = "Services", Emoji = "🔧" }

            };

            await _context.AdCategories.InsertManyAsync(adCategories);



            // Seed Advertisements

            var ads = new[]

            {

                new Advertisement {
                    Title = "iPhone 14 Pro - Excellent Condition",
                    Description = "Like new iPhone 14 Pro, 256GB, comes with original box and accessories. No scratches, battery health 98%.",
                    Price = 799.99m,
                    CategoryName = "Electronics",
                    Subcategory = "Mobiles",
                    Location = "New York, NY",
                    City = "New York",
                    Condition = "Like New",
                    SellerId = user1.Id,
                    SellerName = user1.FullName,
                    SellerPhone = "+1-555-0101",
                    PhoneDisplayStatus = "Visible",
                    SellerEmail = "john@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = true,
                    IsUrgent = false,
                    Views = 245,
                    PostedDate = DateTime.UtcNow.AddDays(-5)
                },

                new Advertisement {
                    Title = "2019 Toyota Camry - Low Mileage",
                    Description = "Well-maintained 2019 Toyota Camry with only 35,000 miles. Clean title, single owner, full service history.",
                    Price = 18500.00m,
                    CategoryName = "Vehicles",
                    Subcategory = "Cars",
                    Location = "Los Angeles, CA",
                    City = "Los Angeles",
                    Condition = "Good",
                    SellerId = user2.Id,
                    SellerName = user2.FullName,
                    SellerPhone = "+1-555-0102",
                    PhoneDisplayStatus = "Hidden",
                    SellerEmail = "jane@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = false,
                    IsUrgent = true,
                    Views = 512,
                    PostedDate = DateTime.UtcNow.AddDays(-10)
                },

                new Advertisement {
                    Title = "Modern Sofa Set - Brand New",
                    Description = "Beautiful 3-piece sofa set, gray fabric, never used. Includes 3-seater, 2-seater, and armchair.",
                    Price = 599.99m,
                    CategoryName = "Furniture",
                    Subcategory = "Sofas",
                    Location = "Chicago, IL",
                    City = "Chicago",
                    Condition = "New",
                    SellerId = user3.Id,
                    SellerName = user3.FullName,
                    SellerPhone = "+1-555-0103",
                    PhoneDisplayStatus = "Visible",
                    SellerEmail = "bob@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
                    },
                    Negotiable = false,
                    IsFeatured = false,
                    IsUrgent = false,
                    Views = 128,
                    PostedDate = DateTime.UtcNow.AddDays(-3)
                },

                new Advertisement {
                    Title = "2BR Apartment for Rent",
                    Description = "Spacious 2-bedroom apartment in downtown area, close to amenities. 1200 sq ft, modern kitchen, parking included.",
                    Price = 1500.00m,
                    CategoryName = "Real Estate",
                    Subcategory = "Apartments",
                    Location = "Houston, TX",
                    City = "Houston",
                    Condition = "Good",
                    SellerId = user4.Id,
                    SellerName = user4.FullName,
                    SellerPhone = "+1-555-0104",
                    PhoneDisplayStatus = "Hidden",
                    SellerEmail = "alice@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = true,
                    IsUrgent = false,
                    Views = 342,
                    PostedDate = DateTime.UtcNow.AddDays(-7)
                },

                new Advertisement {
                    Title = "MacBook Pro 2021 - Refurbished",
                    Description = "MacBook Pro 14-inch M1 Pro, 16GB RAM, 512GB SSD, excellent condition. Includes charger and original box.",
                    Price = 1499.99m,
                    CategoryName = "Electronics",
                    Subcategory = "Laptops",
                    Location = "Seattle, WA",
                    City = "Seattle",
                    Condition = "Good",
                    SellerId = user1.Id,
                    SellerName = user1.FullName,
                    SellerPhone = "+1-555-0101",
                    PhoneDisplayStatus = "Visible",
                    SellerEmail = "john@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = false,
                    IsUrgent = true,
                    Views = 189,
                    PostedDate = DateTime.UtcNow.AddDays(-2)
                },

                new Advertisement {
                    Title = "Royal Enfield Classic 350 - 2022",
                    Description = "Well-maintained Royal Enfield Classic 350, 2022 model, 8000 km. Single owner, all papers clear.",
                    Price = 145000.00m,
                    CategoryName = "Vehicles",
                    Subcategory = "Bikes",
                    Location = "Mumbai, MH",
                    City = "Mumbai",
                    Condition = "Excellent",
                    SellerId = user2.Id,
                    SellerName = user2.FullName,
                    SellerPhone = "+1-555-0102",
                    PhoneDisplayStatus = "Hidden",
                    SellerEmail = "jane@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = true,
                    IsUrgent = false,
                    Views = 678,
                    PostedDate = DateTime.UtcNow.AddDays(-12)
                },

                new Advertisement {
                    Title = "Dining Table Set - 6 Seater",
                    Description = "Solid wood dining table with 6 chairs. Teak finish, excellent condition. Moving sale.",
                    Price = 25000.00m,
                    CategoryName = "Furniture",
                    Subcategory = "Dining",
                    Location = "Bangalore, KA",
                    City = "Bangalore",
                    Condition = "Good",
                    SellerId = user3.Id,
                    SellerName = user3.FullName,
                    SellerPhone = "+1-555-0103",
                    PhoneDisplayStatus = "Visible",
                    SellerEmail = "bob@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=400&fit=crop"
                    },
                    Negotiable = true,
                    IsFeatured = false,
                    IsUrgent = true,
                    Views = 234,
                    PostedDate = DateTime.UtcNow.AddDays(-4)
                },

                new Advertisement {
                    Title = "Samsung Galaxy S23 Ultra",
                    Description = "Brand new Samsung Galaxy S23 Ultra, 512GB, 12GB RAM. Sealed pack with warranty.",
                    Price = 124999.00m,
                    CategoryName = "Electronics",
                    Subcategory = "Mobiles",
                    Location = "Delhi, DL",
                    City = "Delhi",
                    Condition = "New",
                    SellerId = user4.Id,
                    SellerName = user4.FullName,
                    SellerPhone = "+1-555-0104",
                    PhoneDisplayStatus = "Hidden",
                    SellerEmail = "alice@example.com",
                    ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
                    ImageUrls = new List<string> {
                        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop"
                    },
                    Negotiable = false,
                    IsFeatured = true,
                    IsUrgent = true,
                    Views = 891,
                    PostedDate = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Advertisements.InsertManyAsync(ads);



            // Seed Ad Responses

            var adResponses = new[]

            {

                new AdResponse { AdId = ads[0].Id, ResponderId = user2.Id, ResponderName = user2.FullName, Message = "Is this still available? I'm interested." },

                new AdResponse { AdId = ads[1].Id, ResponderId = user3.Id, ResponderName = user3.FullName, Message = "Can you provide more details about the car's history?" }

            };

            await _context.AdResponses.InsertManyAsync(adResponses);



            // Seed Jobs

            var jobs = new[]

            {

                new Job { Title = "Senior Software Engineer", Company = "TechCorp Inc.", Location = "San Francisco, CA", Salary = "$120K-$160K", Type = "Full-time", Description = "We are looking for an experienced software engineer to join our team.", Skills = new List<string> { "C#", ".NET", "React", "MongoDB" } },

                new Job { Title = "Product Manager", Company = "InnovateTech", Location = "New York, NY", Salary = "$110K-$140K", Type = "Full-time", Description = "Lead product development and strategy for our SaaS platform.", Skills = new List<string> { "Product Management", "Agile", "Strategy" } },

                new Job { Title = "UX Designer", Company = "DesignHub", Location = "Remote", Salary = "$80K-$110K", Type = "Remote", Description = "Create beautiful and intuitive user experiences for our clients.", Skills = new List<string> { "Figma", "UI/UX", "Prototyping" } },

                new Job { Title = "Data Analyst Intern", Company = "DataDriven Co.", Location = "Austin, TX", Salary = "$30K-$40K", Type = "Internship", Description = "Learn data analysis and visualization techniques.", Skills = new List<string> { "Python", "SQL", "Excel" } },

                new Job { Title = "DevOps Engineer", Company = "CloudScale", Location = "Seattle, WA", Salary = "$130K-$170K", Type = "Full-time", Description = "Build and maintain cloud infrastructure and CI/CD pipelines.", Skills = new List<string> { "AWS", "Docker", "Kubernetes", "Jenkins" } }

            };

            await _context.Jobs.InsertManyAsync(jobs);



            // Seed Candidates

            var candidates = new[]

            {

                new Candidate { Name = "John Smith", Email = "john@example.com", Phone = "+1-555-0101", Experience = "6 years", Skills = new List<string> { "C#", ".NET", "React", "MongoDB" }, Resume = "john_smith_resume.pdf" },

                new Candidate { Name = "Jane Doe", Email = "jane@example.com", Phone = "+1-555-0102", Experience = "5 years", Skills = new List<string> { "Product Management", "Agile", "Strategy" }, Resume = "jane_doe_resume.pdf" },

                new Candidate { Name = "Bob Wilson", Email = "bob@example.com", Phone = "+1-555-0103", Experience = "4 years", Skills = new List<string> { "Figma", "UI/UX", "Prototyping" }, Resume = "bob_wilson_resume.pdf" }

            };

            await _context.Candidates.InsertManyAsync(candidates);



            // Seed Job Applications

            var applications = new[]

            {

                new JobApplication { JobId = jobs[0].Id, JobTitle = jobs[0].Title, ApplicantId = candidates[0].Id, ApplicantName = candidates[0].Name, Email = candidates[0].Email, Phone = candidates[0].Phone, Resume = candidates[0].Resume, CoverLetter = "I am excited to apply for this position...", Status = "Shortlisted" },

                new JobApplication { JobId = jobs[1].Id, JobTitle = jobs[1].Title, ApplicantId = candidates[1].Id, ApplicantName = candidates[1].Name, Email = candidates[1].Email, Phone = candidates[1].Phone, Resume = candidates[1].Resume, CoverLetter = "With my experience in product management...", Status = "Reviewed" },

                new JobApplication { JobId = jobs[2].Id, JobTitle = jobs[2].Title, ApplicantId = candidates[2].Id, ApplicantName = candidates[2].Name, Email = candidates[2].Email, Phone = candidates[2].Phone, Resume = candidates[2].Resume, CoverLetter = "I have a passion for creating great user experiences...", Status = "Pending" }

            };

            await _context.JobApplications.InsertManyAsync(applications);



            // Seed Transports

            var transports = new[]

            {

                new Transport { Type = "Train", Name = "Express Rail 202", Source = "New York", Destination = "Washington DC", Price = 89.99m, Duration = "3h 30m", Operator = "Amtrak" },

                new Transport { Type = "Bus", Name = "Luxury Coach Express", Source = "Boston", Destination = "New York", Price = 45.99m, Duration = "4h 15m", Operator = "Greyhound" },

                new Transport { Type = "Car", Name = "Premium Sedan Service", Source = "Los Angeles", Destination = "San Diego", Price = 199.99m, Duration = "2h 30m", Operator = "Uber Black" },

                new Transport { Type = "Bike", Name = "Motorcycle Tour", Source = "San Francisco", Destination = "Monterey", Price = 79.99m, Duration = "2h 45m", Operator = "Harley Tours" }

            };

            await _context.Transports.InsertManyAsync(transports);



            // Seed Travel Packages

            var packages = new[]

            {

                new TravelPackage { Name = "European Adventure", Description = "Experience the best of Europe with visits to Paris, Rome, and Barcelona.", Duration = "10 days", Price = 2999.99m, Destinations = new List<string> { "Paris", "Rome", "Barcelona" }, ImageUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop" },

                new TravelPackage { Name = "Tropical Paradise Getaway", Description = "Relax in the beautiful Maldives with pristine beaches and luxury resorts.", Duration = "7 days", Price = 4499.99m, Destinations = new List<string> { "Maldives" }, ImageUrl = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop" },

                new TravelPackage { Name = "Asian Cultural Experience", Description = "Discover the rich culture of Japan with visits to Tokyo, Kyoto, and Osaka.", Duration = "14 days", Price = 3499.99m, Destinations = new List<string> { "Tokyo", "Kyoto", "Osaka" }, ImageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop" }

            };

            await _context.TravelPackages.InsertManyAsync(packages);



            // Seed Movies

            var movies = new[]

            {

                new Movie { Title = "The Quantum Paradox", Genre = "Sci-Fi", Language = "English", Duration = 148, Rating = 8.5, ImageUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop" },

                new Movie { Title = "Midnight in Paris", Genre = "Romance", Language = "French", Duration = 124, Rating = 7.8, ImageUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop" },

                new Movie { Title = "The Last Samurai Returns", Genre = "Action", Language = "Japanese", Duration = 156, Rating = 9.1, ImageUrl = "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=400&fit=crop" },

                new Movie { Title = "Comedy Night", Genre = "Comedy", Language = "English", Duration = 112, Rating = 7.2, ImageUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop" }

            };

            await _context.Movies.InsertManyAsync(movies);



            // Seed Movie Showtimes

            var showtimes = new[]

            {

                new MovieShowtime { MovieId = movies[0].Id, MovieTitle = movies[0].Title, Theater = "Cineplex Downtown", ShowDate = DateTime.Today.AddDays(1), ShowTime = "14:00", ScreenType = "IMAX", Price = 15.99m },

                new MovieShowtime { MovieId = movies[0].Id, MovieTitle = movies[0].Title, Theater = "Cineplex Downtown", ShowDate = DateTime.Today.AddDays(1), ShowTime = "18:00", ScreenType = "Standard", Price = 12.99m },

                new MovieShowtime { MovieId = movies[1].Id, MovieTitle = movies[1].Title, Theater = "Metro Cinema", ShowDate = DateTime.Today.AddDays(1), ShowTime = "16:00", ScreenType = "Standard", Price = 11.99m },

                new MovieShowtime { MovieId = movies[2].Id, MovieTitle = movies[2].Title, Theater = "Grand Theater", ShowDate = DateTime.Today.AddDays(1), ShowTime = "20:00", ScreenType = "IMAX", Price = 16.99m },

                new MovieShowtime { MovieId = movies[3].Id, MovieTitle = movies[3].Title, Theater = "Cineplex Downtown", ShowDate = DateTime.Today.AddDays(1), ShowTime = "19:00", ScreenType = "Standard", Price = 10.99m }

            };

            await _context.MovieShowtimes.InsertManyAsync(showtimes);



            // Seed Bookings

            var bookings = new[]

            {

                new Booking { UserId = user1.Id, UserName = user1.FullName, Type = "Transport", ItemId = transports[0].Id, ItemName = transports[0].Name, Quantity = 2, TotalPrice = 179.98m, BookingDate = DateTime.Today.AddDays(5), Status = "Confirmed" },

                new Booking { UserId = user2.Id, UserName = user2.FullName, Type = "Package", ItemId = packages[0].Id, ItemName = packages[0].Name, Quantity = 2, TotalPrice = 5999.98m, BookingDate = DateTime.Today.AddDays(30), Status = "Confirmed" },

                new Booking { UserId = user3.Id, UserName = user3.FullName, Type = "Movie", ItemId = showtimes[0].Id, ItemName = showtimes[0].MovieTitle, Quantity = 3, TotalPrice = 47.97m, BookingDate = DateTime.Today.AddDays(1), Status = "Completed" }

            };

            await _context.Bookings.InsertManyAsync(bookings);



            // Seed States (India)

            var states = new[]

            {

                new State { Name = "Andhra Pradesh", Code = "AP" },

                new State { Name = "Arunachal Pradesh", Code = "AR" },

                new State { Name = "Assam", Code = "AS" },

                new State { Name = "Bihar", Code = "BR" },

                new State { Name = "Chhattisgarh", Code = "CG" },

                new State { Name = "Delhi", Code = "DL" },

                new State { Name = "Goa", Code = "GA" },

                new State { Name = "Gujarat", Code = "GJ" },

                new State { Name = "Haryana", Code = "HR" },

                new State { Name = "Himachal Pradesh", Code = "HP" },

                new State { Name = "Jharkhand", Code = "JH" },

                new State { Name = "Karnataka", Code = "KA" },

                new State { Name = "Kerala", Code = "KL" },

                new State { Name = "Madhya Pradesh", Code = "MP" },

                new State { Name = "Maharashtra", Code = "MH" },

                new State { Name = "Manipur", Code = "MN" },

                new State { Name = "Meghalaya", Code = "ML" },

                new State { Name = "Mizoram", Code = "MZ" },

                new State { Name = "Nagaland", Code = "NL" },

                new State { Name = "Odisha", Code = "OD" },

                new State { Name = "Punjab", Code = "PB" },

                new State { Name = "Rajasthan", Code = "RJ" },

                new State { Name = "Sikkim", Code = "SK" },

                new State { Name = "Tamil Nadu", Code = "TN" },

                new State { Name = "Telangana", Code = "TG" },

                new State { Name = "Tripura", Code = "TR" },

                new State { Name = "Uttar Pradesh", Code = "UP" },

                new State { Name = "Uttarakhand", Code = "UK" },

                new State { Name = "West Bengal", Code = "WB" }

            };

            await _context.States.InsertManyAsync(states);



            // Seed Districts (India)

            var districts = new[]

            {

                new District { Name = "Anantapur", StateCode = "AP" },

                new District { Name = "Chittoor", StateCode = "AP" },

                new District { Name = "East Godavari", StateCode = "AP" },

                new District { Name = "Guntur", StateCode = "AP" },

                new District { Name = "Krishna", StateCode = "AP" },

                new District { Name = "Kurnool", StateCode = "AP" },

                new District { Name = "Prakasam", StateCode = "AP" },

                new District { Name = "Srikakulam", StateCode = "AP" },

                new District { Name = "Visakhapatnam", StateCode = "AP" },

                new District { Name = "Vizianagaram", StateCode = "AP" },

                new District { Name = "West Godavari", StateCode = "AP" },

                new District { Name = "Central Delhi", StateCode = "DL" },

                new District { Name = "East Delhi", StateCode = "DL" },

                new District { Name = "New Delhi", StateCode = "DL" },

                new District { Name = "North Delhi", StateCode = "DL" },

                new District { Name = "South Delhi", StateCode = "DL" },

                new District { Name = "West Delhi", StateCode = "DL" },

                new District { Name = "Ahmedabad", StateCode = "GJ" },

                new District { Name = "Bharuch", StateCode = "GJ" },

                new District { Name = "Gandhinagar", StateCode = "GJ" },

                new District { Name = "Surat", StateCode = "GJ" },

                new District { Name = "Vadodara", StateCode = "GJ" },

                new District { Name = "Bangalore Rural", StateCode = "KA" },

                new District { Name = "Bangalore Urban", StateCode = "KA" },

                new District { Name = "Belgaum", StateCode = "KA" },

                new District { Name = "Mysore", StateCode = "KA" },

                new District { Name = "Chennai", StateCode = "TN" },

                new District { Name = "Coimbatore", StateCode = "TN" },

                new District { Name = "Madurai", StateCode = "TN" },

                new District { Name = "Mumbai City", StateCode = "MH" },

                new District { Name = "Mumbai Suburban", StateCode = "MH" },

                new District { Name = "Pune", StateCode = "MH" },

                new District { Name = "Thane", StateCode = "MH" },

                new District { Name = "Kolkata", StateCode = "WB" },

                new District { Name = "Howrah", StateCode = "WB" },

                new District { Name = "North 24 Parganas", StateCode = "WB" },

                new District { Name = "South 24 Parganas", StateCode = "WB" },

                new District { Name = "Hyderabad", StateCode = "TG" },

                new District { Name = "Ranga Reddy", StateCode = "TG" },

                new District { Name = "Medak", StateCode = "TG" },

                new District { Name = "Lucknow", StateCode = "UP" },

                new District { Name = "Kanpur", StateCode = "UP" },

                new District { Name = "Agra", StateCode = "UP" },

                new District { Name = "Varanasi", StateCode = "UP" },

                new District { Name = "Jaipur", StateCode = "RJ" },

                new District { Name = "Jodhpur", StateCode = "RJ" },

                new District { Name = "Udaipur", StateCode = "RJ" },

                new District { Name = "Chandigarh", StateCode = "PB" },

                new District { Name = "Amritsar", StateCode = "PB" },

                new District { Name = "Ludhiana", StateCode = "PB" }

            };

            await _context.Districts.InsertManyAsync(districts);

        }

    }

}


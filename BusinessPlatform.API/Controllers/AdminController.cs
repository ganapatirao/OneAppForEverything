using System.Security.Claims;
using System.Text;
using BusinessPlatform.API.Models;
using BusinessPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using MongoDB.Driver;

namespace BusinessPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly MongoDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(MongoDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string HashPassword(string password)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id!),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (user == null || user.Password != HashPassword(request.Password))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new { message = "Account is inactive" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { user.Id, user.Email, user.FullName, user.Role } });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingUser = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = HashPassword(request.Password),
                FullName = request.FullName,
                Phone = request.Phone,
                Role = "User",
                IsActive = true
            };

            await _context.Users.InsertOneAsync(user);
            return Ok(new { message = "User registered successfully", user });
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Find(_ => true).ToListAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        [Authorize]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(user);
        }

        [HttpPut("users/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User user)
        {
            var existingUser = await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (existingUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Only update password if a new one is provided
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = HashPassword(user.Password);
            }
            else
            {
                user.Password = existingUser.Password;
            }

            user.Id = id;
            var result = await _context.Users.ReplaceOneAsync(u => u.Id == id, user);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("users/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _context.Users.DeleteOneAsync(u => u.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.Password = HashPassword(request.NewPassword);
            var result = await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(new { message = "Password reset successfully" });
        }

        [HttpGet("dashboard")]
        [Authorize]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers = (int)await _context.Users.CountDocumentsAsync(FilterDefinition<User>.Empty);
            var totalProducts = (int)await _context.Products.CountDocumentsAsync(FilterDefinition<Product>.Empty);
            var totalOrders = (int)await _context.ShoppingOrders.CountDocumentsAsync(FilterDefinition<ShoppingOrder>.Empty);
            var totalAds = (int)await _context.Advertisements.CountDocumentsAsync(FilterDefinition<Advertisement>.Empty);
            var totalJobs = (int)await _context.Jobs.CountDocumentsAsync(FilterDefinition<Job>.Empty);
            var totalBookings = (int)await _context.Bookings.CountDocumentsAsync(FilterDefinition<Booking>.Empty);

            var orders = await _context.ShoppingOrders.Find(FilterDefinition<ShoppingOrder>.Empty).ToListAsync();
            var totalRevenue = orders.Where(o => o.Status == "Delivered").Sum(o => o.Total);

            var dashboard = new AdminDashboard
            {
                TotalUsers = (int)totalUsers,
                TotalProducts = (int)totalProducts,
                TotalOrders = (int)totalOrders,
                TotalAds = (int)totalAds,
                TotalJobs = (int)totalJobs,
                TotalBookings = (int)totalBookings,
                TotalRevenue = (double)totalRevenue
            };

            return Ok(dashboard);
        }

        [HttpGet("orders/all")]
        [Authorize]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.ShoppingOrders.Find(FilterDefinition<ShoppingOrder>.Empty).ToListAsync();
            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<ShoppingOrder>.Update.Set(o => o.Status, request.Status);
            var result = await _context.ShoppingOrders.UpdateOneAsync(o => o.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Order not found" });
            }
            return Ok(new { message = "Order status updated successfully" });
        }

        [HttpDelete("orders/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrder(string id)
        {
            var result = await _context.ShoppingOrders.DeleteOneAsync(o => o.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Order not found" });
            }
            return Ok(new { message = "Order deleted successfully" });
        }

        // Products CRUD
        [HttpPost("products")]
        [Authorize]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            product.Id = null;
            product.CreatedAt = DateTime.UtcNow;
            await _context.Products.InsertOneAsync(product);
            return Ok(new { message = "Product created successfully", product });
        }

        [HttpPut("products/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] Product product)
        {
            product.Id = id;
            var result = await _context.Products.ReplaceOneAsync(p => p.Id == id, product);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(new { message = "Product updated successfully" });
        }

        [HttpDelete("products/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var product = await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            var result = await _context.Products.DeleteOneAsync(p => p.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Product not found" });
            }

            // Check if there are any other products in the same category
            var remainingProducts = await _context.Products.Find(p => p.CategoryName == product.CategoryName).CountDocumentsAsync();
            if (remainingProducts == 0)
            {
                // Delete the category if no products remain
                await _context.Categories.DeleteOneAsync(c => c.Name == product.CategoryName);
            }

            return Ok(new { message = "Product deleted successfully" });
        }

        [HttpPatch("products/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateProductStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<Product>.Update.Set(p => p.Status, request.Status);
            var result = await _context.Products.UpdateOneAsync(p => p.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(new { message = "Product status updated successfully" });
        }

        // Ads CRUD
        [HttpPost("ads")]
        [Authorize]
        public async Task<IActionResult> CreateAd([FromBody] Advertisement ad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState });
            }

            // Additional validation for image URLs
            if (!string.IsNullOrEmpty(ad.ImageUrl) && !Uri.TryCreate(ad.ImageUrl, UriKind.Absolute, out _))
            {
                return BadRequest(new { message = "Invalid image URL format" });
            }

            if (ad.ImageUrls != null)
            {
                foreach (var url in ad.ImageUrls)
                {
                    if (!string.IsNullOrEmpty(url) && !Uri.TryCreate(url, UriKind.Absolute, out _))
                    {
                        return BadRequest(new { message = "Invalid image URL format in additional images" });
                    }
                }
            }

            ad.Id = null;
            ad.CreatedAt = DateTime.UtcNow;
            ad.UpdatedAt = DateTime.UtcNow;
            await _context.Advertisements.InsertOneAsync(ad);
            return Ok(new { message = "Advertisement created successfully", ad });
        }

        [HttpPut("ads/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateAd(string id, [FromBody] Advertisement ad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState });
            }

            // Additional validation for image URLs
            if (!string.IsNullOrEmpty(ad.ImageUrl) && !Uri.TryCreate(ad.ImageUrl, UriKind.Absolute, out _))
            {
                return BadRequest(new { message = "Invalid image URL format" });
            }

            if (ad.ImageUrls != null)
            {
                foreach (var url in ad.ImageUrls)
                {
                    if (!string.IsNullOrEmpty(url) && !Uri.TryCreate(url, UriKind.Absolute, out _))
                    {
                        return BadRequest(new { message = "Invalid image URL format in additional images" });
                    }
                }
            }

            ad.Id = id;
            ad.UpdatedAt = DateTime.UtcNow;
            var result = await _context.Advertisements.ReplaceOneAsync(a => a.Id == id, ad);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Advertisement not found" });
            }
            return Ok(new { message = "Advertisement updated successfully" });
        }

        [HttpDelete("ads/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAd(string id)
        {
            var result = await _context.Advertisements.DeleteOneAsync(a => a.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Advertisement not found" });
            }
            return Ok(new { message = "Advertisement deleted successfully" });
        }

        [HttpPatch("ads/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateAdStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<Advertisement>.Update.Set(a => a.Status, request.Status);
            var result = await _context.Advertisements.UpdateOneAsync(a => a.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Advertisement not found" });
            }
            return Ok(new { message = "Advertisement status updated successfully" });
        }

        // Seed Data
        [HttpPost("seed-data")]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                var seedData = new SeedData(_context);
                await seedData.SeedAsync();
                return Ok(new { message = "Data seeded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error seeding data", error = ex.Message });
            }
        }

        // Jobs CRUD
        [HttpGet("jobs")]
        [Authorize]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs.Find(_ => true).ToListAsync();
            return Ok(jobs);
        }

        [HttpPost("jobs")]
        [Authorize]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            job.Id = null;
            job.CreatedAt = DateTime.UtcNow;
            await _context.Jobs.InsertOneAsync(job);
            return Ok(new { message = "Job created successfully", job });
        }

        [HttpPut("jobs/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateJob(string id, [FromBody] Job job)
        {
            job.Id = id;
            var result = await _context.Jobs.ReplaceOneAsync(j => j.Id == id, job);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Job not found" });
            }
            return Ok(new { message = "Job updated successfully" });
        }

        [HttpDelete("jobs/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteJob(string id)
        {
            var result = await _context.Jobs.DeleteOneAsync(j => j.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Job not found" });
            }
            return Ok(new { message = "Job deleted successfully" });
        }

        [HttpPatch("jobs/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateJobStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<Job>.Update.Set(j => j.Status, request.Status);
            var result = await _context.Jobs.UpdateOneAsync(j => j.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Job not found" });
            }
            return Ok(new { message = "Job status updated successfully" });
        }

        // Transports CRUD
        [HttpPost("transports")]
        [Authorize]
        public async Task<IActionResult> CreateTransport([FromBody] Transport transport)
        {
            transport.Id = null;
            transport.CreatedAt = DateTime.UtcNow;
            await _context.Transports.InsertOneAsync(transport);
            return Ok(new { message = "Transport created successfully", transport });
        }

        [HttpPut("transports/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTransport(string id, [FromBody] Transport transport)
        {
            transport.Id = id;
            var result = await _context.Transports.ReplaceOneAsync(t => t.Id == id, transport);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Transport not found" });
            }
            return Ok(new { message = "Transport updated successfully" });
        }

        [HttpDelete("transports/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTransport(string id)
        {
            var result = await _context.Transports.DeleteOneAsync(t => t.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Transport not found" });
            }
            return Ok(new { message = "Transport deleted successfully" });
        }

        [HttpPatch("transports/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateTransportStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<Transport>.Update.Set(t => t.Status, request.Status);
            var result = await _context.Transports.UpdateOneAsync(t => t.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Transport not found" });
            }
            return Ok(new { message = "Transport status updated successfully" });
        }

        // Packages CRUD
        [HttpPost("packages")]
        [Authorize]
        public async Task<IActionResult> CreatePackage([FromBody] TravelPackage package)
        {
            package.Id = null;
            package.CreatedAt = DateTime.UtcNow;
            await _context.TravelPackages.InsertOneAsync(package);
            return Ok(new { message = "Travel package created successfully", package });
        }

        [HttpPut("packages/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePackage(string id, [FromBody] TravelPackage package)
        {
            package.Id = id;
            var result = await _context.TravelPackages.ReplaceOneAsync(p => p.Id == id, package);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Travel package not found" });
            }
            return Ok(new { message = "Travel package updated successfully" });
        }

        [HttpDelete("packages/{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePackage(string id)
        {
            var result = await _context.TravelPackages.DeleteOneAsync(p => p.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Travel package not found" });
            }
            return Ok(new { message = "Travel package deleted successfully" });
        }

        [HttpPatch("packages/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdatePackageStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<TravelPackage>.Update.Set(p => p.Status, request.Status);
            var result = await _context.TravelPackages.UpdateOneAsync(p => p.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Travel package not found" });
            }
            return Ok(new { message = "Travel package status updated successfully" });
        }

        // Movies CRUD
        [HttpPost("movies")]
        [Authorize]
        public async Task<IActionResult> CreateMovie([FromBody] Movie movie)
        {
            movie.Id = null;
            movie.CreatedAt = DateTime.UtcNow;
            await _context.Movies.InsertOneAsync(movie);
            return Ok(new { message = "Movie created successfully", movie });
        }

        [HttpPut("movies/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateMovie(string id, [FromBody] Movie movie)
        {
            movie.Id = id;
            var result = await _context.Movies.ReplaceOneAsync(m => m.Id == id, movie);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Movie not found" });
            }
            return Ok(new { message = "Movie updated successfully" });
        }

        [HttpDelete("movies/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var result = await _context.Movies.DeleteOneAsync(m => m.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Movie not found" });
            }
            return Ok(new { message = "Movie deleted successfully" });
        }

        [HttpPatch("movies/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateMovieStatus(string id, [FromBody] StatusUpdateRequest request)
        {
            var update = Builders<Movie>.Update.Set(m => m.Status, request.Status);
            var result = await _context.Movies.UpdateOneAsync(m => m.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Movie not found" });
            }
            return Ok(new { message = "Movie status updated successfully" });
        }

        // Ad Categories
        [HttpGet("ad-categories")]
        [Authorize]
        public async Task<IActionResult> GetAdCategories()
        {
            var categories = await _context.AdCategories.Find(_ => true).ToListAsync();
            return Ok(categories);
        }

        [HttpPost("ad-categories")]
        [Authorize]
        public async Task<IActionResult> CreateAdCategory([FromBody] AdCategory category)
        {
            category.Id = null;
            category.CreatedAt = DateTime.UtcNow;
            await _context.AdCategories.InsertOneAsync(category);
            return Ok(new { message = "Category created successfully", category });
        }

        [HttpDelete("ad-categories/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAdCategory(string id)
        {
            var result = await _context.AdCategories.DeleteOneAsync(c => c.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Category not found" });
            }
            return Ok(new { message = "Category deleted successfully" });
        }

        // User Activate/Deactivate
        [HttpPatch("users/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateUserStatus(string id, [FromBody] UserStatusUpdateRequest request)
        {
            var update = Builders<User>.Update.Set(u => u.IsActive, request.IsActive);
            var result = await _context.Users.UpdateOneAsync(u => u.Id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(new { message = "User status updated successfully" });
        }
    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UserStatusUpdateRequest
    {
        public bool IsActive { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

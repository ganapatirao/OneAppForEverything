using BusinessPlatform.API.Models;
using BusinessPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BusinessPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public ShoppingController(MongoDbContext context)
        {
            _context = context;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.Find(_ => true).ToListAsync();
            var categories = await _context.Categories.Find(_ => true).ToListAsync();
            
            var sortedProducts = products
                .Join(categories, 
                    p => p.CategoryName, 
                    c => c.Name, 
                    (p, c) => new { Product = p, Category = c })
                .OrderBy(x => x.Category.DisplaySequence)
                .ThenBy(x => x.Product.DisplaySequence)
                .Select(x => x.Product)
                .ToList();
            
            return Ok(sortedProducts);
        }

        [HttpGet("products/{id}")]
        public async Task<IActionResult> GetProduct(string id)
        {
            var product = await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(product);
        }

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

        [HttpPut("products/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateProductStatus(string id, [FromBody] StatusUpdate update)
        {
            var updateDef = Builders<Product>.Update.Set(p => p.Status, update.Status);
            var result = await _context.Products.UpdateOneAsync(p => p.Id == id, updateDef);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(new { message = "Product status updated successfully" });
        }

        [HttpDelete("products/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var result = await _context.Products.DeleteOneAsync(p => p.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(new { message = "Product deleted successfully" });
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] bool includeAll = false)
        {
            var categories = await _context.Categories.Find(_ => true).ToListAsync();
            var sortedCategories = categories.OrderBy(c => c.DisplaySequence).ToList();

            if (includeAll)
            {
                // Return all categories for admin
                return Ok(sortedCategories);
            }

            var products = await _context.Products.Find(_ => true).ToListAsync();

            // Filter categories that have at least one active product
            var categoriesWithActiveProducts = sortedCategories
                .Where(c => products.Any(p => p.CategoryName == c.Name && p.Status == "Active"))
                .ToList();

            return Ok(categoriesWithActiveProducts);
        }

        [HttpPost("categories")]
        [Authorize]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            category.Id = null;
            category.CreatedAt = DateTime.UtcNow;
            await _context.Categories.InsertOneAsync(category);
            return Ok(new { message = "Category created successfully", category });
        }

        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] ShoppingOrder order)
        {
            order.Id = null;
            order.CreatedAt = DateTime.UtcNow;

            // Validate and calculate total based on current product prices
            decimal calculatedTotal = 0;
            foreach (var item in order.Items)
            {
                var product = await _context.Products.Find(p => p.Id == item.ProductId).FirstOrDefaultAsync();
                if (product == null)
                {
                    return BadRequest(new { message = $"Product {item.ProductName} not found" });
                }

                decimal itemPrice = product.Price;

                if (!string.IsNullOrEmpty(item.SizeOptionName))
                {
                    var sizeOption = product.SizeOptions?.FirstOrDefault(so => so.Name == item.SizeOptionName);
                    if (sizeOption == null)
                    {
                        return BadRequest(new { message = $"Invalid size option for {item.ProductName}" });
                    }
                    if (product.OfferPercentage > 0)
                    {
                        itemPrice = product.Price - (product.Price * product.OfferPercentage / 100);
                    }
                    itemPrice += sizeOption.PriceAdjustment;
                }
                else
                {
                    if (product.OfferPercentage > 0)
                    {
                        itemPrice = product.Price - (product.Price * product.OfferPercentage / 100);
                    }
                }

                // Validate item price
                if (item.Price != itemPrice)
                {
                    return BadRequest(new { message = $"Price validation failed for {item.ProductName}. Please try again." });
                }

                calculatedTotal += itemPrice * item.Quantity;
            }

            // Validate total
            if (order.Total != calculatedTotal)
            {
                return BadRequest(new { message = "Total validation failed. Please try again." });
            }

            await _context.ShoppingOrders.InsertOneAsync(order);

            // Clear cart
            await _context.ShoppingCartItems.DeleteManyAsync(c => c.UserId == order.UserId);

            return Ok(new { message = "Order created successfully", order });
        }

        [HttpGet("orders")]
        [Authorize]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.ShoppingOrders.Find(_ => true).ToListAsync();
            return Ok(orders);
        }

        [HttpGet("orders/user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders(string userId)
        {
            var orders = await _context.ShoppingOrders.Find(o => o.UserId == userId).ToListAsync();
            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] StatusUpdate update)
        {
            var updateDef = Builders<ShoppingOrder>.Update.Set(o => o.Status, update.Status);
            var result = await _context.ShoppingOrders.UpdateOneAsync(o => o.Id == id, updateDef);
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

        [HttpGet("cart/{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            var cartItems = await _context.ShoppingCartItems.Find(c => c.UserId == userId).ToListAsync();
            return Ok(cartItems);
        }

        [HttpPost("cart")]
        public async Task<IActionResult> AddToCart([FromBody] ShoppingCartItem item)
        {
            item.Id = null;
            item.CreatedAt = DateTime.UtcNow;

            // Fetch product to validate and calculate price
            var product = await _context.Products.Find(p => p.Id == item.ProductId).FirstOrDefaultAsync();
            if (product == null)
            {
                return BadRequest(new { message = "Product not found" });
            }

            // Validate and calculate price based on size option
            decimal calculatedPrice = product.Price;

            if (!string.IsNullOrEmpty(item.SizeOptionName))
            {
                var sizeOption = product.SizeOptions?.FirstOrDefault(so => so.Name == item.SizeOptionName);
                if (sizeOption == null)
                {
                    return BadRequest(new { message = "Invalid size option" });
                }

                // Check stock
                if (sizeOption.Stock < item.Quantity)
                {
                    return BadRequest(new { message = "Insufficient stock for selected size" });
                }

                // Calculate price with offer percentage and size adjustment
                if (product.OfferPercentage > 0)
                {
                    calculatedPrice = product.Price - (product.Price * product.OfferPercentage / 100);
                }
                calculatedPrice += sizeOption.PriceAdjustment;
            }
            else
            {
                // No size option selected - use base price with offer
                if (product.OfferPercentage > 0)
                {
                    calculatedPrice = product.Price - (product.Price * product.OfferPercentage / 100);
                }

                // Check base stock
                if (product.Stock < item.Quantity)
                {
                    return BadRequest(new { message = "Insufficient stock" });
                }
            }

            // Validate that the provided price matches calculated price (prevent tampering)
            if (item.Price != calculatedPrice)
            {
                return BadRequest(new { message = "Price validation failed. Please try again." });
            }

            // Check for existing cart item with same product and size option
            var existing = await _context.ShoppingCartItems
                .Find(c => c.UserId == item.UserId && c.ProductId == item.ProductId && c.SizeOptionName == item.SizeOptionName)
                .FirstOrDefaultAsync();

            if (existing != null)
            {
                var updateDef = Builders<ShoppingCartItem>.Update.Inc(c => c.Quantity, item.Quantity);
                await _context.ShoppingCartItems.UpdateOneAsync(c => c.Id == existing.Id, updateDef);
            }
            else
            {
                await _context.ShoppingCartItems.InsertOneAsync(item);
            }

            return Ok(new { message = "Item added to cart successfully", price = calculatedPrice });
        }

        [HttpDelete("cart/{id}")]
        public async Task<IActionResult> RemoveFromCart(string id)
        {
            var result = await _context.ShoppingCartItems.DeleteOneAsync(c => c.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "Cart item not found" });
            }
            return Ok(new { message = "Item removed from cart successfully" });
        }

        [HttpDelete("cart/user/{userId}")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            await _context.ShoppingCartItems.DeleteManyAsync(c => c.UserId == userId);
            return Ok(new { message = "Cart cleared successfully" });
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetStates()
        {
            var states = await _context.States.Find(_ => true).ToListAsync();
            return Ok(states);
        }

        [HttpGet("districts/{stateCode}")]
        public async Task<IActionResult> GetDistricts(string stateCode)
        {
            var districts = await _context.Districts.Find(d => d.StateCode == stateCode).ToListAsync();
            return Ok(districts);
        }
    }
}

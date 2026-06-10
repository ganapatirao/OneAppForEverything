using BusinessPlatform.API.Data;
using BusinessPlatform.API.Models;
using BusinessPlatform.API.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BusinessPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValidationController : ControllerBase
    {
        private readonly ValidationService _validationService;
        private readonly MongoDbContext _context;

        public ValidationController(ValidationService validationService, MongoDbContext context)
        {
            _validationService = validationService;
            _context = context;
        }

        [HttpGet("settings/{entityType}")]
        public async Task<ActionResult<Dictionary<string, ValidationSetting>>> GetValidationSettings(string entityType)
        {
            try
            {
                var settings = await _validationService.GetValidationSettingsAsync(entityType);
                return Ok(settings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("validate")]
        public ActionResult<ValidationResult> ValidateField([FromBody] ValidationRequest request)
        {
            try
            {
                var settings = _validationService.GetValidationSettingsAsync(request.EntityType).Result;
                if (!settings.ContainsKey(request.FieldName))
                {
                    return BadRequest(new { error = "Field not found in validation settings" });
                }

                var result = _validationService.ValidateField(request.FieldName, request.Value, settings[request.FieldName]);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("seed")]
        public async Task<ActionResult> SeedValidationData()
        {
            try
            {
                var seedData = ValidationSeedData.GetCheckoutValidationSettings();
                
                // Check if data already exists
                var existingCount = await _context.ValidationSettings.CountDocumentsAsync(Builders<ValidationSetting>.Filter.Eq(v => v.EntityType, "checkout"));
                
                if (existingCount == 0)
                {
                    await _context.ValidationSettings.InsertManyAsync(seedData);
                    return Ok(new { message = $"Seeded {seedData.Count} validation settings" });
                }
                
                return Ok(new { message = "Validation settings already exist" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("invalidate-cache/{entityType?}")]
        public ActionResult InvalidateCache(string entityType = null)
        {
            try
            {
                _validationService.InvalidateCache(entityType);
                return Ok(new { message = "Cache invalidated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class ValidationRequest
    {
        public string EntityType { get; set; } = string.Empty;
        public string FieldName { get; set; } = string.Empty;
        public object? Value { get; set; }
    }
}

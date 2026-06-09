using BusinessPlatform.API.Models;
using BusinessPlatform.API.Services;
using MongoDB.Driver;

namespace BusinessPlatform.API.Seed
{
    public class LocationSeedData
    {
        private readonly MongoDbContext _context;

        public LocationSeedData(MongoDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            await _context.States.DeleteManyAsync(_ => true);
            await _context.Districts.DeleteManyAsync(_ => true);

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

            // Seed Districts
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
                new District { Name = "Yanam", StateCode = "AP" },
                new District { Name = "East Delhi", StateCode = "DL" },
                new District { Name = "New Delhi", StateCode = "DL" },
                new District { Name = "North Delhi", StateCode = "DL" },
                new District { Name = "North East Delhi", StateCode = "DL" },
                new District { Name = "North West Delhi", StateCode = "DL" },
                new District { Name = "South Delhi", StateCode = "DL" },
                new District { Name = "South West Delhi", StateCode = "DL" },
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

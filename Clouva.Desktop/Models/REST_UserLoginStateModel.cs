using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace Clouva.Desktop.Models
{
    public class REST_UserLoginStateModel
    {
        [JsonPropertyName("id")]
        [JsonProperty("id")]
        public ulong Id { get; set; }

        [JsonPropertyName("created_at")]
        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("email")]
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonPropertyName("email_confirmed")]
        [JsonProperty("email_confirmed")]
        public bool EmailConfirmed { get; set; }

        [JsonPropertyName("username")]
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonPropertyName("plan_name")]
        [JsonProperty("plan_name")]
        public string PlanName { get; set; }

        [JsonPropertyName("valid_to")]
        [JsonProperty("valid_to")]
        public DateTime ValidTo { get; set; }
    }
}

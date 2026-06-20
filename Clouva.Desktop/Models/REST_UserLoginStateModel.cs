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

        [JsonPropertyName("first_name")]
        [JsonProperty("first_name")]
        public string? FirstName { get; set; }

        [JsonPropertyName("last_name")]
        [JsonProperty("last_name")]
        public string? LastName { get; set; }


        /* User subscriptions */
        [JsonPropertyName("plan_name")]
        [JsonProperty("plan_name")]
        public string PlanName { get; set; }

        [JsonPropertyName("valid_to")]
        [JsonProperty("valid_to")]
        public DateTime? ValidTo { get; set; }

        [JsonPropertyName("tokens_used")]
        [JsonProperty("tokens_used")]
        public int TokensUsed { get; set; }

        [JsonPropertyName("tokens_limit")]
        [JsonProperty("tokens_limit")]
        public int TokensLimit { get; set; }

        [JsonPropertyName("amount")]
        [JsonProperty("amount")]
        public double Amount { get; set; }

        [JsonPropertyName("currency")]
        [JsonProperty("currency")]
        public string Currency { get; set; }


        /* User permissions */
        [JsonPropertyName("can_change_email")]
        [JsonProperty("can_change_email")]
        public bool CanChangeEmail { get; set; }

        [JsonPropertyName("can_delete_account")]
        [JsonProperty("can_delete_account")]
        public bool CanDeleteAccount { get; set; }
    }
}

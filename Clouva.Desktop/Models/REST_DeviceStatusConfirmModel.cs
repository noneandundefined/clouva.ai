using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Clouva.Desktop.Models
{
    public class REST_DeviceStatusConfirmModel
    {
        [JsonPropertyName("created_at")]
        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("device_id")]
        [JsonProperty("device_id")]
        public string DeviceId { get; set; }

        [JsonPropertyName("session_id")]
        [JsonProperty("session_id")]
        public string SessionId { get; set; }

        [JsonPropertyName("confirmed")]
        [JsonProperty("confirmed")]
        public bool Confirmed { get; set; }
    }
}

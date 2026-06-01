using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Clouva.Desktop.Models
{
    public class REST_DeviceCreateAuthSessionModel
    {
        [JsonPropertyName("device_id")]
        [JsonProperty("device_id")]
        public string DeviceId { get; set; }
    }
}

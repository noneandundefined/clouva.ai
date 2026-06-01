using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Services;
using System.Threading.Tasks;

namespace Clouva.Desktop.Repository
{
    public class DeviceApiRepository : IDeviceApiRepository
    {
        private readonly HttpClientService _httpClient = new(Config.Current.HTTP_SERVER_ADDR);

        private readonly string _apiPath = "device";

        public async Task<string> DeviceCreateAuthSession(REST_DeviceCreateAuthSessionModel payload)
        {
            return await this._httpClient.PostAsync<string?>($"{this._apiPath}/create-session", payload);
        }

        public async Task<REST_DeviceStatusConfirmModel> DeviceStatusConfirm(string sessionId)
        {
            return await this._httpClient.GetAsync<REST_DeviceStatusConfirmModel?>($"{this._apiPath}/status/{sessionId}");
        }
    }
}

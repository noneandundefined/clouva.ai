using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Services;
using System.Threading.Tasks;

namespace Clouva.Desktop.Repository
{
    public class UserApiRepository : IUserApiRepository
    {
        private readonly HttpClientService _httpClient = new(Config.Current.HTTP_SERVER_ADDR);

        private readonly string _apiPath = "users";

        public async Task<REST_UserLoginStateModel?> UserGetLoginState()
        {
            REST_UserLoginStateModel? loginState = await this._httpClient.GetAsync<REST_UserLoginStateModel?>($"{this._apiPath}/login-state");

            if (loginState != null)
            {
                AppSession.CurrentUser = loginState;
            }

            return loginState;
        }
    }
}

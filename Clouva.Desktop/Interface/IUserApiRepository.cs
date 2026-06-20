using Clouva.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clouva.Desktop.Interface
{
    public interface IUserApiRepository
    {
        Task<REST_UserLoginStateModel?> UserGetLoginState();
    }
}

using Clouva.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clouva.Desktop.Interface
{
    public interface IDeviceApiRepository
    {
        Task<string?> DeviceCreateAuthSession(REST_DeviceCreateAuthSessionModel payload);

        Task<REST_DeviceStatusConfirmModel?> DeviceStatusConfirm(string sessionId);
    }
}

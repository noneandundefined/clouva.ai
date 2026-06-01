using Clouva.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clouva.Desktop.Core
{
    public static class AppSession
    {
        public static REST_UserLoginStateModel? CurrentUser { get; set; }
    }
}

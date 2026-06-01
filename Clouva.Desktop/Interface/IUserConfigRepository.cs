using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Clouva.Desktop.Interface
{
    public interface IUserConfigRepository
    {
        string? GetString(string key);

        void Set(string key, string value);

        void DeleteKey(string key);
    }
}

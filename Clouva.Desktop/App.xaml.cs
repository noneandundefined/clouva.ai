using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace Clouva.Desktop
{
    /// <summary>
    /// Логика взаимодействия для App.xaml
    /// </summary>
    public partial class App : Application
    {
        private void App_Startup(object sender, StartupEventArgs e)
        {
            var bootstrap = new BootstrapWindow();
            bootstrap.Show();
        }
    }
}

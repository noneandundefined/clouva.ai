using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Repository;
using System;
using System.Windows;

namespace Clouva.Desktop
{
    /// <summary>
    /// Логика взаимодействия для BootstrapWindow.xaml
    /// </summary>
    public partial class BootstrapWindow : Window
    {
        private readonly IUserApiRepository _userApi = new UserApiRepository();
        private readonly IUserConfigRepository _userConfig = new UserConfigRepository();

        public BootstrapWindow()
        {
            InitializeComponent();
            this.Loaded += BootstrapWindow_Loaded;
        }

        private async void BootstrapWindow_Loaded(object sender, RoutedEventArgs e)
        {
            string? sessionId = this._userConfig.GetString(UserConfigState.AUTH_SESSION_ID);

            try
            {
                if (!string.IsNullOrWhiteSpace(sessionId))
                {
                    try
                    {
                        REST_UserLoginStateModel? user = await this._userApi.UserGetLoginState();

                        if (user == null) return;

                        // if (!user.ConfirmEmail)

                        MainWindow mainWindow = new();
                        mainWindow.Show();
                    }
                    catch (Exception ex)
                    {
                        AuthWindow authWindow = new();
                        authWindow.Show();
                    }
                }
                else
                {
                    AuthWindow authWindow = new();
                    authWindow.Show();
                }
            }
            finally
            {
                this.Close();
            }
        }
    }
}

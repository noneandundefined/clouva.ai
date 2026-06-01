using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Repository;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows;

namespace Clouva.Desktop
{
    /// <summary>
    /// Логика взаимодействия для AuthWindow.xaml
    /// </summary>
    public partial class AuthWindow : Window
    {
        private readonly IUserConfigRepository _userConf = new UserConfigRepository();
        private readonly IDeviceApiRepository _desktopApi = new DeviceApiRepository();

        private string _tempSessionId;
        private bool _isPolling = true;

        public AuthWindow()
        {
            InitializeComponent();
        }

        private async Task StartDesktopAuthFlow(string type)
        {
            try
            {
                AuthContentGrid.Visibility = Visibility.Collapsed;
                LoadingGrid.Visibility = Visibility.Visible;

                REST_DeviceCreateAuthSessionModel payload = new()
                {
                    DeviceId = GetOrCreateDeviceId(),
                };

                var response = await this._desktopApi.DeviceCreateAuthSession(payload);

                if (response == null || string.IsNullOrWhiteSpace(response))
                {
                    return;
                }

                this._tempSessionId = response;

                string url = $"{Config.Current.CLIENT_ADDR}/authorize?session_id={_tempSessionId}&type={type}";

                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });

                this._isPolling = true;

                _ = this.PollDesktopConfirmation();
            }
            catch (Exception ex)
            {
                AuthContentGrid.Visibility = Visibility.Visible;
                LoadingGrid.Visibility = Visibility.Collapsed;
            }
        }

        private async Task PollDesktopConfirmation()
        {
            while (this._isPolling)
            {
                try
                {
                    var response = await this._desktopApi.DeviceStatusConfirm(this._tempSessionId);

                    if (response != null && response.Confirmed && !string.IsNullOrWhiteSpace(response.SessionId))
                    {
                        this._isPolling = false;

                        this._userConf.Set(UserConfigState.AUTH_SESSION_ID, response.SessionId);

                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            var mainWindow = new MainWindow();

                            Application.Current.MainWindow = mainWindow;

                            mainWindow.Show();
                            this.Close();
                        });

                        return;
                    }
                }
                catch
                {
                }

                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }

        private async void SignUpButton_Click(object sender, RoutedEventArgs e)
        {
            await this.StartDesktopAuthFlow("signup");
        }

        private async void LogInButton_Click(object sender, RoutedEventArgs e)
        {
            await this.StartDesktopAuthFlow("login");
        }

        private string GetOrCreateDeviceId()
        {
            var deviceId = this._userConf.GetString(UserConfigState.DEVICE_ID);

            if (!string.IsNullOrWhiteSpace(deviceId))
            {
                return deviceId;
            }

            deviceId = Guid.NewGuid().ToString();
            this._userConf.Set(UserConfigState.DEVICE_ID, deviceId);

            return deviceId;
        }
    }
}

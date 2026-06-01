using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace Clouva.Desktop.Services
{
    public class HttpClientService
    {
        private readonly HttpClient _httpClient;
        private readonly IUserConfigRepository _userConf = new UserConfigRepository();

        private static bool _isAuthWindowOpen = false;

        public HttpClientService(string baseUrl)
        {
            this._httpClient = new HttpClient
            {
                BaseAddress = new Uri(baseUrl)
            };

            string sessionId = this._userConf.GetString(UserConfigState.AUTH_SESSION_ID);

            if (sessionId != null)
            {
                this._httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", this._userConf.GetString(UserConfigState.AUTH_SESSION_ID));
            }
        }

        #region Public API

        #region GET

        public async Task<T> GetAsync<T>(string endpoint) where T : class
        {
            try
            {
                var response = await this._httpClient.GetAsync(endpoint);
                return await this.HandleResponse<T>(response, "GET", endpoint);
            }
            catch (HttpRequestException ex)
            {
                Logger.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #region POST

        public async Task<T?> PostAsync<T>(string endpoint, object data) where T : class
        {
            try
            {
                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await this._httpClient.PostAsync(endpoint, content);
                return await HandleResponse<T>(response, "POST", endpoint);
            }
            catch (HttpRequestException ex)
            {
                Logger.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #region PUT

        public async Task<T?> PutAsync<T>(string endpoint, object data) where T : class
        {
            try
            {
                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await this._httpClient.PutAsync(endpoint, content);
                return await HandleResponse<T>(response, "PUT", endpoint);
            }
            catch (HttpRequestException ex)
            {
                Logger.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #region PATCH

        public async Task<T?> PatchAsync<T>(string endpoint, object data) where T : class
        {
            try
            {
                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), endpoint)
                {
                    Content = content
                };

                var response = await this._httpClient.SendAsync(request);
                return await HandleResponse<T>(response, "PATCH", endpoint);
            }
            catch (HttpRequestException ex)
            {
                Logger.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #region DELETE

        public async Task<T?> DeleteAsync<T>(string endpoint) where T : class
        {
            try
            {
                var response = await this._httpClient.DeleteAsync(endpoint);
                return await HandleResponse<T>(response, "DELETE", endpoint);
            }
            catch (HttpRequestException ex)
            {
                Logger.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #endregion

        #region Response Handling

        public async Task<T> HandleResponse<T>(HttpResponseMessage response, string method, string endpoint) where T : class
        {
            var text = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    Logger.Error($"[{method}] {endpoint} -> 401 Unauthorized");

                    this.HandleUnauthorized();

                    return default;
                }

                string message = this.ExtractErrorMessage(text);

                Logger.Error($"[{method}] {endpoint} -> {response.StatusCode}: {message}");
                this.ShowError(message ?? $"Ошибка {response.StatusCode}");

                return default;
            }

            Logger.Info($"[{method}] {endpoint} -> OK ({response.StatusCode})");

            try
            {
                var apiResponse = JsonSerializer.Deserialize<API_ResponseModel<T>>(text, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return apiResponse?.Message;
            }
            catch (Exception ex)
            {
                Logger.Error($"Deserialize error: {ex.Message}");
                this.ShowError("Ошибка при разборе ответа сервера.");

                return default;
            }
        }

        private string ExtractErrorMessage(string responseBody)
        {
            try
            {
                var doc = JsonDocument.Parse(responseBody);

                if (doc.RootElement.TryGetProperty("message", out var msg))
                {
                    return msg.GetString();
                }
            }
            catch
            {
            }

            if (!string.IsNullOrWhiteSpace(responseBody))
            {
                return responseBody.Trim();
            }

            return null;
        }

        private void HandleUnauthorized()
        {
            if (_isAuthWindowOpen) return;
            _isAuthWindowOpen = true;

            this._userConf.DeleteKey(UserConfigState.AUTH_SESSION_ID);

            Application.Current.Dispatcher.Invoke(() =>
            {
                foreach (Window window in Application.Current.Windows)
                {
                    if (window is MainWindow)
                    {
                        window.Close();
                        break;
                    }
                }

                var authWindow = new AuthWindow();

                authWindow.Closed += (_, _) => _isAuthWindowOpen = false;
                authWindow.Show();
            });
        }

        #endregion

        private void ShowError(string message)
        {
            //Notification.Show("Ошибка", message, NotificationType.Error);
        }
    }
}

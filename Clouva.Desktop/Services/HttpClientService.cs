using Clouva.Desktop.Core;
using Clouva.Desktop.Interface;
using Clouva.Desktop.Models;
using Clouva.Desktop.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
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
                var request = new HttpRequestMessage(HttpMethod.Get, endpoint);

                var response = await this._httpClient.GetAsync(endpoint);

                return await this.HandleResponse<T>(response, request, "GET", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
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

                var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = content
                };

                var response = await this._httpClient.SendAsync(request);

                return await HandleResponse<T>(response, request, "POST", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
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

                var request = new HttpRequestMessage(HttpMethod.Put, endpoint)
                {
                    Content = content
                };

                var response = await this._httpClient.SendAsync(request);

                return await HandleResponse<T>(response, request, "PUT", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
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

                return await HandleResponse<T>(response, request, "PATCH", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
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
                var request = new HttpRequestMessage(HttpMethod.Delete, endpoint);

                var response = await this._httpClient.SendAsync(request);

                return await HandleResponse<T>(response, request, "DELETE", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                this.ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
                this.ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #region FILE

        public async Task<T?> PostTextAsFileAsync<T>(string endpoint, string text, string fileName = "input.txt") where T : class
        {
            var tempPath = Path.Combine(Path.GetTempPath(), $"clouva-input-{Guid.NewGuid():N}.txt");

            try
            {
                File.WriteAllText(tempPath, text, Encoding.UTF8);
                return await this.PostFileAsync<T>(endpoint, tempPath, "file");
            }
            finally
            {
                try
                {
                    if (File.Exists(tempPath))
                    {
                        File.Delete(tempPath);
                    }
                }
                catch
                {
                }
            }
        }

        public async Task<T?> PostFileAsync<T>(string endpoint, string filePath, string fieldName = "file") where T : class
        {
            try
            {
                using var form = new MultipartFormDataContent();

                using var stream = File.OpenRead(filePath);

                var fileContent = new StreamContent(stream);

                fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                form.Add(fileContent, fieldName, Path.GetFileName(filePath));

                var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = form
                };

                var response = await this._httpClient.SendAsync(request);

                return await HandleResponse<T>(response, request, "POST", endpoint);
            }
            catch (HttpRequestException ex)
            {
                LoggerService.Error($"Network error: {ex.Message}");
                ShowError("Ошибка сети: нет соединения с сервером.");
            }
            catch (Exception ex)
            {
                LoggerService.Error($"Unexpected error: {ex.Message}");
                ShowError($"Неизвестная ошибка: {ex.Message}");
            }

            return default;
        }

        #endregion

        #endregion

        #region Response Handling

        public async Task<T> HandleResponse<T>(HttpResponseMessage response, HttpRequestMessage request, string method, string endpoint) where T : class
        {
            var text = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // PoW DDoS
                if ((int)response.StatusCode == 429)
                {
                    try
                    {
                        var doc = JsonDocument.Parse(text);

                        if (doc.RootElement.TryGetProperty("error", out var error))
                        {
                            string challenge = error.GetProperty("challenge").GetString();
                            int difficulty = int.Parse(error.GetProperty("difficulty").GetString());

                            LoggerService.Info($"PoW required. Difficulty={difficulty}");

                            string nonce = await Task.Run(() => PowSolverService.Solve(challenge, difficulty));

                            LoggerService.Info($"PoW solved: {nonce}");

                            var retry = await this.CloneRequestAsync(request);

                            retry.Headers.Add("Pow-Challenge", challenge);
                            retry.Headers.Add("Pow-Nonce", nonce);

                            response.Dispose();

                            var retryResponse = await _httpClient.SendAsync(retry);

                            return await HandleResponse<T>(retryResponse, retry, method, endpoint);
                        }
                    }
                    catch (Exception ex)
                    {
                        LoggerService.Error($"PoW error: {ex.Message}");
                    }
                }

                // Unauthorized
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    LoggerService.Error($"[{method}] {endpoint} -> 401 Unauthorized");

                    this.HandleUnauthorized();

                    return default;
                }

                string message = this.ExtractErrorMessage(text);

                LoggerService.Error($"[{method}] {endpoint} -> {response.StatusCode}: {message}");
                this.ShowError(message ?? $"Ошибка {response.StatusCode}");

                return default;
            }

            LoggerService.Info($"[{method}] {endpoint} -> OK ({response.StatusCode})");

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
                LoggerService.Error($"Deserialize error: {ex.Message}");
                this.ShowError("Ошибка при разборе ответа сервера.");

                return default;
            }
        }

        private async Task<HttpRequestMessage> CloneRequestAsync(HttpRequestMessage request)
        {
            var clone = new HttpRequestMessage(request.Method, request.RequestUri);

            foreach (var header in request.Headers) clone.Headers.TryAddWithoutValidation(header.Key, header.Value);

            if (request.Content != null)
            {
                var ms = new MemoryStream();
                await request.Content.CopyToAsync(ms);
                ms.Position = 0;

                var content = new StreamContent(ms);

                foreach (var header in request.Content.Headers) content.Headers.TryAddWithoutValidation(header.Key, header.Value);

                clone.Content = content;
            }

            return clone;
        }

        private string ExtractErrorMessage(string responseBody)
        {
            try
            {
                var doc = JsonDocument.Parse(responseBody);

                if (doc.RootElement.TryGetProperty("error", out var msg))
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
            MessageBox.Show(message, "Error message from server", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}

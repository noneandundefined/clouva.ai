using System;
using System.IO;

namespace Clouva.Desktop.Core
{
    public class AppConfig
    {
        [Newtonsoft.Json.JsonProperty("TYPE_RELEASE")]
        public string TYPE_RELEASE { get; } =
#if DEBUG
            "dev";
#else
            "prod";
#endif

        [Newtonsoft.Json.JsonProperty("APP_NAME")]
        public string APP_NAME { get; } = "Clouva.ai";

        [Newtonsoft.Json.JsonProperty("APP_FOLDER")]
        public string APP_FOLDER_PATH { get; } = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Clouva.ai");

        [Newtonsoft.Json.JsonProperty("CONFIG_USER_PATH")]
        public string CONFIG_USER_PATH { get; }

        [Newtonsoft.Json.JsonProperty("LOGS_PATH")]
        public string LOGS_PATH { get; }

        [Newtonsoft.Json.JsonProperty("HTTP_SERVER_ADDR")]
        public string HTTP_SERVER_ADDR { get; } =
#if DEBUG
            "http://localhost:8080/api/v1/";
#else
            "https://clouva.ai/api/v1/";
#endif

        [Newtonsoft.Json.JsonProperty("CLIENT_ADDR")]
        public string CLIENT_ADDR { get; } =
#if DEBUG
            "http://localhost:5173";
#else
            "https://clouva.ai";
#endif

        public AppConfig()
        {
            this.CONFIG_USER_PATH = Path.Combine(APP_FOLDER_PATH, "user.config");
            this.LOGS_PATH = Path.Combine(APP_FOLDER_PATH, "Logs");
        }
    }

    public static class Config
    {
        public static AppConfig Current { get; } = new AppConfig();
    }
}

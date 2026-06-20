using Clouva.Desktop.Core;
using System;
using System.IO;
using System.Text;

namespace Clouva.Desktop.Services
{
    public static class LoggerService
    {
        static LoggerService()
        {
            var path = Config.Current?.LOGS_PATH;

            if (!string.IsNullOrEmpty(path))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            }
        }

        private static void Log(string level, string message, string fileName)
        {
            string folderName = DateTime.Now.ToString("dd.MM");
            string logFolder = Path.Combine(Config.Current.LOGS_PATH, folderName);

            Directory.CreateDirectory(logFolder);

            string logFilePath = Path.Combine(logFolder, fileName);

            string logLine = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{level}] {message}";

            try
            {
                File.AppendAllText(logFilePath, logLine + Environment.NewLine, Encoding.UTF8);
            }
            catch
            {
            }
        }

        public static void Info(string message)
        {
            Log("INFO", message, "Info.log");
        }

        public static void Error(string message)
        {
            Log("ERROR", message, "Error.log");
        }
    }
}

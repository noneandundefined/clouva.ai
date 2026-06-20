using System;
using System.Globalization;
using System.Speech.Recognition;

namespace Clouva.Desktop.Services
{
    public static class SpeechToTextService
    {
        private static readonly string[] Cultures = { "ru-RU", "en-US" };

        public static string Transcribe(string wavPath)
        {
            foreach (var cultureName in Cultures)
            {
                try
                {
                    using var recognizer = new SpeechRecognitionEngine(new CultureInfo(cultureName));
                    recognizer.SetInputToWaveFile(wavPath);
                    recognizer.LoadGrammar(new DictationGrammar());

                    var result = recognizer.Recognize(TimeSpan.FromSeconds(30));
                    if (result != null && !string.IsNullOrWhiteSpace(result.Text))
                    {
                        return result.Text.Trim();
                    }
                }
                catch (Exception ex)
                {
                    LoggerService.Error($"Speech recognition ({cultureName}): {ex.Message}");
                }
            }

            return string.Empty;
        }
    }
}

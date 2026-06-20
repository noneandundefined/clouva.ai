using Clouva.Desktop.Core;
using NAudio.Wave;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Clouva.Desktop.Services
{
    public class AudioRecordService
    {
        private WaveInEvent? _waveIn;
        private WaveFileWriter? _writer;
        public string RecordFile { get; } = Path.Combine(Path.GetTempPath(), "clouva-record.wav");

        private readonly FocusWindowService _focusWindowService;
        private readonly HttpClientService _httpClient = new(Config.Current.HTTP_SERVER_ADDR);

        public float CurrentLevel { get; private set; }

        public AudioRecordService(FocusWindowService focusWindowService)
        {
            this._focusWindowService = focusWindowService;
        }

        public void Start()
        {
            this._waveIn = new WaveInEvent
            {
                WaveFormat = new WaveFormat(16000, 1),
                BufferMilliseconds = 50
            };

            this._writer = new WaveFileWriter(this.RecordFile, this._waveIn.WaveFormat);

            this._waveIn.DataAvailable += (s, e) =>
            {
                this._writer.Write(e.Buffer, 0, e.BytesRecorded);

                float max = 0;

                for (int i = 0; i < e.BytesRecorded; i += 2)
                {
                    short sample = (short)(e.Buffer[i] | (e.Buffer[i + 1] << 8));
                    float value = Math.Abs(sample / 32768f);

                    if (value > max) max = value;
                }

                this.CurrentLevel = max;

                Console.WriteLine(max);
            };

            this._waveIn.StartRecording();
        }

        public async Task Stop()
        {
            this._waveIn?.StopRecording();
            this._waveIn?.Dispose();
            this._waveIn = null;

            this._writer?.Dispose();
            this._writer = null;

            string transcribed = SpeechToTextService.Transcribe(this.RecordFile);
            if (string.IsNullOrWhiteSpace(transcribed))
            {
                LoggerService.Error("Speech recognition returned empty text.");
                return;
            }

            string? text = await this._httpClient.PostTextAsFileAsync<string>("text/rewrite", transcribed);
            if (string.IsNullOrWhiteSpace(text))
            {
                return;
            }

            this._focusWindowService.InsertText(text);
        }
    }
}

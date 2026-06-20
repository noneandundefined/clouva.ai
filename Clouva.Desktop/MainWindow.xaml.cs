using Clouva.Desktop.Services;
using Clouva.Desktop.Utilities;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Threading;

namespace Clouva.Desktop
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private bool recording;
        private readonly DispatcherTimer timer = new();
        private static readonly Random rnd = new Random();

        private AudioRecordService recorder;

        private readonly FocusWindowService _focusWindowService = new();

        public MainWindow()
        {
            InitializeComponent();

            Loaded += (_, _) => this._focusWindowService.RegisterSelfWindow(this);

            Deactivated += (_, _) =>
            {
                this._focusWindowService.SaveCurrentWindow();
            };
            this.recorder = new(this._focusWindowService);

            timer.Interval = TimeSpan.FromMilliseconds(40);

            timer.Tick += (_, _) =>
            {
                double level = this.recorder?.CurrentLevel ?? 0;

                double amplified = Math.Log10(level * 140 + 1) * 110;
                double height = MathUtils.Clamp(amplified, 5, 45);

                AnimateBar(B1, height * (0.6 + rnd.NextDouble() * 0.4));
                AnimateBar(B2, height * (0.7 + rnd.NextDouble() * 0.3));
                AnimateBar(B3, height * (0.8 + rnd.NextDouble() * 0.4));
                AnimateBar(B4, height * (0.9 + rnd.NextDouble() * 0.5));
                AnimateBar(B5, height * (0.8 + rnd.NextDouble() * 0.4));
                AnimateBar(B6, height * (0.7 + rnd.NextDouble() * 0.3));
                AnimateBar(B7, height * (0.6 + rnd.NextDouble() * 0.4));
            };
        }

        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
            {
                try
                {
                    DragMove();
                }
                catch
                {
                }
            }
        }

        private void AnimateBar(Border bar, double newHeight)
        {
            var animation = new DoubleAnimation
            {
                To = newHeight,
                Duration = TimeSpan.FromMilliseconds(120)
            };

            bar.BeginAnimation(HeightProperty, animation);
        }

        private void MicButton_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (!recording)
            {
                this._focusWindowService.SaveCurrentWindow();
            }
        }

        private async void MicButton_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            var animation = new DoubleAnimationUsingKeyFrames();

            animation.KeyFrames.Add(
                new EasingDoubleKeyFrame(0.85, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(60)))
            );

            animation.KeyFrames.Add(
                new EasingDoubleKeyFrame(1.05, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(120)))
            );

            animation.KeyFrames.Add(
                new EasingDoubleKeyFrame(1.0, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(180)))
            );

            var scale = (ScaleTransform)MicButton.RenderTransform;

            scale.BeginAnimation(ScaleTransform.ScaleXProperty, animation);
            scale.BeginAnimation(ScaleTransform.ScaleYProperty, animation);

            scale.BeginAnimation(
                ScaleTransform.ScaleXProperty,
                new DoubleAnimationUsingKeyFrames
                {
                    KeyFrames =
                    {
                    new EasingDoubleKeyFrame(0.9, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(60))),
                    new EasingDoubleKeyFrame(1.0, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(120)))
                    }
                });

            scale.BeginAnimation(
                ScaleTransform.ScaleYProperty,
                new DoubleAnimationUsingKeyFrames
                {
                    KeyFrames =
                    {
                    new EasingDoubleKeyFrame(0.9, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(60))),
                    new EasingDoubleKeyFrame(1.0, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(120)))
                    }
                });

            recording = !recording;

            if (recording)
            {
                MicIcon.Visibility = Visibility.Collapsed;
                Bars.Visibility = Visibility.Visible;

                this.recorder = new(this._focusWindowService);
                this.recorder.Start();

                this.timer.Start();
            }
            else
            {
                this.timer.Stop();

                var activeRecorder = this.recorder;
                this.recorder = null;

                Bars.Visibility = Visibility.Collapsed;
                MicIcon.Visibility = Visibility.Visible;

                if (activeRecorder != null)
                {
                    await activeRecorder.Stop();
                }
            }
        }
    }
}

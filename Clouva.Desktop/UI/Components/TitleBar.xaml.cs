using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Interop;

namespace Clouva.Desktop.UI.Components
{
    /// <summary>
    /// Логика взаимодействия для TitleBar.xaml
    /// </summary>
    public partial class TitleBar : UserControl
    {
        public TitleBar()
        {
            InitializeComponent();

            Loaded += TitleBar_Loaded;
        }

        private void TitleBar_Loaded(object sender, RoutedEventArgs e)
        {
            var window = Window.GetWindow(this);

            if (window == null) return;

            var hwnd = new WindowInteropHelper(window).Handle;
            var source = HwndSource.FromHwnd(hwnd);

            if (source != null)
            {
                source.AddHook(WndProc);
            }
        }

        private Window GetParentWindow()
        {
            return Window.GetWindow(this);
        }

        #region OnSourceInitialized

        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            const int WM_NCHITTEST = 0x0084;

            const int HTLEFT = 10;
            const int HTRIGHT = 11;
            const int HTTOP = 12;
            const int HTTOPLEFT = 13;
            const int HTTOPRIGHT = 14;
            const int HTBOTTOM = 15;
            const int HTBOTTOMLEFT = 16;
            const int HTBOTTOMRIGHT = 17;

            const int BORDER_WIDTH = 8;

            if (msg == WM_NCHITTEST)
            {
                var window = GetParentWindow();

                if (window == null)
                    return IntPtr.Zero;

                int x = (short)(lParam.ToInt64() & 0xFFFF);
                int y = (short)((lParam.ToInt64() >> 16) & 0xFFFF);

                Point pos = window.PointFromScreen(new Point(x, y));

                double width = window.ActualWidth;
                double height = window.ActualHeight;

                IntPtr result = IntPtr.Zero;

                if (pos.Y <= BORDER_WIDTH)
                {
                    if (pos.X <= BORDER_WIDTH)
                        result = (IntPtr)HTTOPLEFT;

                    else if (pos.X >= width - BORDER_WIDTH)
                        result = (IntPtr)HTTOPRIGHT;

                    else
                        result = (IntPtr)HTTOP;
                }
                else if (pos.Y >= height - BORDER_WIDTH)
                {
                    if (pos.X <= BORDER_WIDTH)
                        result = (IntPtr)HTBOTTOMLEFT;

                    else if (pos.X >= width - BORDER_WIDTH)
                        result = (IntPtr)HTBOTTOMRIGHT;

                    else
                        result = (IntPtr)HTBOTTOM;
                }
                else if (pos.X <= BORDER_WIDTH)
                {
                    result = (IntPtr)HTLEFT;
                }
                else if (pos.X >= width - BORDER_WIDTH)
                {
                    result = (IntPtr)HTRIGHT;
                }

                if (result != IntPtr.Zero)
                {
                    handled = true;
                    return result;
                }
            }

            return IntPtr.Zero;
        }

        #endregion

        private void Minimize_Click(object sender, RoutedEventArgs e)
        {
            var window = this.GetParentWindow();

            if (window != null)
            {
                window.WindowState = WindowState.Minimized;
            }
        }

        private void Maximize_Click(object sender, RoutedEventArgs e)
        {
            var window = this.GetParentWindow();

            if (window != null)
            {
                window.WindowState = window.WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
            }
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            this.GetParentWindow()?.Close();
        }

        private void TitleBar_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                this.GetParentWindow()?.DragMove();
            }
        }
    }
}

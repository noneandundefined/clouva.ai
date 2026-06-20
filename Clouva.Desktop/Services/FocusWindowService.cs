using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Interop;

namespace Clouva.Desktop.Services
{
    public class FocusWindowService
    {
        private IntPtr _lastWindow;
        private IntPtr _selfWindow;

        private const int SwRestore = 9;
        private const uint InputKeyboard = 1;
        private const uint KeyeventfKeyup = 0x0002;
        private const ushort VkControl = 0x11;
        private const ushort VkV = 0x56;

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool IsWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

        [DllImport("kernel32.dll")]
        private static extern uint GetCurrentThreadId();

        [DllImport("user32.dll")]
        private static extern bool AttachThreadInput(uint attachThread, uint attachToThread, bool attach);

        [DllImport("user32.dll")]
        private static extern bool BringWindowToTop(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool AllowSetForegroundWindow(int processId);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

        [StructLayout(LayoutKind.Sequential)]
        private struct INPUT
        {
            public uint type;
            public InputUnion U;
        }

        [StructLayout(LayoutKind.Explicit)]
        private struct InputUnion
        {
            [FieldOffset(0)] public KEYBDINPUT ki;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct KEYBDINPUT
        {
            public ushort wVk;
            public ushort wScan;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        public void RegisterSelfWindow(Window window)
        {
            _selfWindow = new WindowInteropHelper(window).Handle;
        }

        public void SaveCurrentWindow()
        {
            var hwnd = GetForegroundWindow();
            if (hwnd != IntPtr.Zero && hwnd != _selfWindow)
            {
                _lastWindow = hwnd;
            }
        }

        public void InsertText(string? text)
        {
            if (string.IsNullOrWhiteSpace(text) || _lastWindow == IntPtr.Zero || !IsWindow(_lastWindow))
            {
                return;
            }

            var app = Application.Current;
            if (app == null)
            {
                return;
            }

            app.Dispatcher.Invoke(() =>
            {
                try
                {
                    Clipboard.SetText(text);
                }
                catch (Exception ex)
                {
                    LoggerService.Error($"Clipboard error: {ex.Message}");
                    return;
                }

                RestoreForegroundWindow();
                Thread.Sleep(150);
                SendPasteShortcut();
            });
        }

        private void RestoreForegroundWindow()
        {
            GetWindowThreadProcessId(_lastWindow, out uint targetProcessId);
            AllowSetForegroundWindow((int)targetProcessId);
            ShowWindow(_lastWindow, SwRestore);

            uint targetThread = GetWindowThreadProcessId(_lastWindow, out _);
            uint currentThread = GetCurrentThreadId();
            bool attached = AttachThreadInput(currentThread, targetThread, true);

            try
            {
                SetForegroundWindow(_lastWindow);
                BringWindowToTop(_lastWindow);
            }
            finally
            {
                if (attached)
                {
                    AttachThreadInput(currentThread, targetThread, false);
                }
            }
        }

        private static void SendPasteShortcut()
        {
            var inputs = new INPUT[4];
            inputs[0] = KeyInput(VkControl, false);
            inputs[1] = KeyInput(VkV, false);
            inputs[2] = KeyInput(VkV, true);
            inputs[3] = KeyInput(VkControl, true);

            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT)));
        }

        private static INPUT KeyInput(ushort key, bool keyUp)
        {
            return new INPUT
            {
                type = InputKeyboard,
                U = new InputUnion
                {
                    ki = new KEYBDINPUT
                    {
                        wVk = key,
                        dwFlags = keyUp ? KeyeventfKeyup : 0
                    }
                }
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Clouva.Desktop.Services
{
    public static class PowSolverService
    {
        public static string Solve(string challenge, int difficulty)
        {
            long nonce = 0;

            using var sha = SHA256.Create();

            while (true)
            {
                string input = challenge + nonce;

                byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(input));

                if (MatchesDifficulty(hash, difficulty)) return nonce.ToString();

                nonce++;
            }
        }

        private static bool MatchesDifficulty(byte[] hash, int difficulty)
        {
            for (int i = 0; i < difficulty; i++)
            {
                int byteIdx = i / 2;
                bool highNibble = i % 2 == 0;

                byte value = hash[byteIdx];

                if (highNibble)
                {
                    if ((value >> 4) != 0) return false;
                }
                else
                {
                    if ((value & 0x0F) != 0) return false;
                }
            }

            return true;
        }
    }
}

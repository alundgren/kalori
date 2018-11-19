using System;
using System.IO;
using System.IO.Compression;
using System.Xml.Linq;

namespace lv_data_transformer
{
    class Program
    {
        static void Main(string[] args)
        {
            var zipfilename = args.Length > 0 ? args[0] : @"..\data\Livsmedelsverket-Naringsvarden-20171215.zip";
            var tempFolder = Path.Combine(Path.GetTempPath(), $"kalori-safetodelete-{Guid.NewGuid().ToString()}");            
            try 
            {
                ZipFile.ExtractToDirectory(zipfilename, tempFolder);
                var xmlfilename = Path.Combine(tempFolder, "Livsmedelsverket-Naringsvarden-20171215.xml");
                var document = XDocument.Load(xmlfilename);
                /*
                    Structure
                    LivsmedelDataset 1:1 (Version, LivsmedelsLista)
                    LivsmedelsLista 1: * (Livsmedel)
                    Livsmedel 1:1 (Nummer, Namn, ViktGram, Huvudgrupp, Naringsvarden)
                    ViktGram: Ie 100
                    Naringsvarden 1: * (Naringsvarde)
                    Naringsvarde 1:1 (Namn, Forkortning, Varde, Enhet, SenastAndrad)
                    Exempel näringsvärden:
                    [Namn; Enhet; Värde]
                    Energi (kcal); kcal; 656
                    Kolhydrater; g; 0,00
                    Protein; g; 7,00
                    Fett; g; 71,00
                 */
            }
            finally 
            {
                if(Directory.Exists(tempFolder))
                {
                    try { Directory.Delete(tempFolder, true); } catch { /* ignored */ }
                }
            }
            
                       
        }
    }
}

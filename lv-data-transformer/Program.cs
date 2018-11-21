using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Xml.Linq;

namespace lv_data_transformer
{
    class Program
    {
        private static string GetValue(XElement source, string name) 
        {
            return source.Elements().Single(x => x.Name.LocalName == name).Value;
        }

        static void Main(string[] args)
        {
            var zipfilename = args.Length > 0 ? args[0] : @"..\data\Livsmedelsverket-Naringsvarden-20171215.zip";
            var tempFolder = Path.Combine(Path.GetTempPath(), $"kalori-safetodelete-{Guid.NewGuid().ToString()}");            
            try 
            {
                ZipFile.ExtractToDirectory(zipfilename, tempFolder);
                var xmlfilename = Path.Combine(tempFolder, "Livsmedelsverket-Naringsvarden-20171215.xml");
                var document = XDocument.Load(xmlfilename);
                var items = document.Descendants().Where(x => x.Name.LocalName == "Livsmedel").Select(x => 
                    {
                        var nv = x.Elements().Single(y => y.Name.LocalName == "Naringsvarden");
                        return new 
                        {
                            Namn = GetValue(x, "Namn"),
                            ViktGram = GetValue(x, "ViktGram"),
                            Kcal = GetValue(nv.Elements().Where(y => GetValue(y, "Namn") == "Energi (kcal)").Single(), "Varde")
                        };
                    });
                foreach(var i in items)
                    Console.WriteLine($"{i.Namn}: {i.Kcal}");
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

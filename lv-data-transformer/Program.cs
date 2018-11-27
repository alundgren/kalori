using System;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Xml.Linq;
using Newtonsoft.Json;

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
                Func<string, int> parseDecimal = x => 
                    (int)Math.Ceiling(decimal.Parse(x?.Replace(",", "."), NumberStyles.Number, CultureInfo.InvariantCulture));

                var items = document.Descendants().Where(x => x.Name.LocalName == "Livsmedel").Select(x => 
                    {
                        var nv = x.Elements().Single(y => y.Name.LocalName == "Naringsvarden");
                        return new 
                        {
                            Namn = GetValue(x, "Namn"),
                            ViktGram = GetValue(x, "ViktGram"),
                            Kcal = parseDecimal(GetValue(nv.Elements().Where(y => GetValue(y, "Namn") == "Energi (kcal)").Single(), "Varde")),
                            Protein = parseDecimal(GetValue(nv.Elements().Where(y => GetValue(y, "Namn") == "Protein").Single(), "Varde")),
                            Fett = parseDecimal(GetValue(nv.Elements().Where(y => GetValue(y, "Namn") == "Fett").Single(), "Varde")),
                            Kolhydrater = parseDecimal(GetValue(nv.Elements().Where(y => GetValue(y, "Namn") == "Kolhydrater").Single(), "Varde")),
                        };
                    }).Where(x => x.ViktGram == "100").Select(x => new [] { x.Namn, x.Kcal.ToString(), x.Protein.ToString(), x.Fett.ToString(), x.Kolhydrater.ToString() } ) ;

                var result = new string[][] {new string [] { "Kcal", "Protein", "Fett", "Kolhydrater"}}.Union(items).ToArray();

                var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
                Directory.CreateDirectory(tempDir);
                try 
                {
                    File.WriteAllText(Path.Combine(tempDir, "naringsvarden.json"), JsonConvert.SerializeObject(result));
                    ZipFile.CreateFromDirectory(tempDir, args.Length > 1 ? args[1] : @"..\data\Livsmedelsverket-Naringsvarden-20171215-Compacted.zip");
                }
                catch 
                {
                    try { Directory.Delete(tempDir); } catch { /* ignored */ }
                }

                

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

using System;
using System.Text.Json;
using SharpAstrology.Enums;
using SharpAstrology.Utility;
using SharpAstrology.DataModels;

namespace HumanDesignCalculator
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 3)
            {
                Console.Error.WriteLine("Usage: HumanDesignCalculator <datetime> <latitude> <longitude>");
                Environment.Exit(1);
            }

            try
            {
                // 解析参数
                DateTime birthDateTime = DateTime.Parse(args[0]).ToUniversalTime();
                double latitude = double.Parse(args[1]);
                double longitude = double.Parse(args[2]);

                // 计算个性端时间 (出生时刻)
                var personalityTime = birthDateTime;

                // 计算设计端时间 (出生前88度，约88天)
                var designTime = birthDateTime.AddDays(-88);

                // 使用SwissEph计算行星位置
                // 注意：这里需要实现SwissEph的调用逻辑
                // 简化版：直接使用SharpAstrology的Activation计算

                var result = new
                {
                    personality = CalculatePlanets(personalityTime, latitude, longitude),
                    design = CalculatePlanets(designTime, latitude, longitude)
                };

                // 输出JSON
                string json = JsonSerializer.Serialize(result, new JsonSerializerOptions
                {
                    WriteIndented = false
                });

                Console.WriteLine(json);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
                Environment.Exit(1);
            }
        }

        static Dictionary<string, object> CalculatePlanets(DateTime dateTime, double lat, double lon)
        {
            var planets = new Dictionary<string, object>();

            // 注意：这里需要实际的星历表计算
            // 目前使用模拟数据，实际应该调用SwissEph或其他星历库

            // 示例：使用固定的测试数据
            // 实际应该是：
            // - 使用SwissEph计算太阳、月亮、行星的黄道经度
            // - 转换为人类图的闸门/爻线/颜色/音调/基调

            var planetNames = new[] {
                "Sun", "Earth", "Moon", "NorthNode", "SouthNode",
                "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
                "Uranus", "Neptune", "Pluto"
            };

            foreach (var planetName in planetNames)
            {
                // 这里应该调用实际的星历计算
                // 暂时返回空数据，让前端知道需要实现
                planets[planetName] = new
                {
                    gate = 0,
                    line = 0,
                    color = 0,
                    tone = 0,
                    @base = 0,
                    longitude = 0.0
                };
            }

            return planets;
        }
    }
}

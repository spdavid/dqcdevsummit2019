using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SignalRDemo.Models;

namespace SignalRDemo
{
    public static class TweetBroadcaster
    {
        [FunctionName("TweetBroadcaster")]
        public static Task Run([QueueTrigger("twitter", Connection = "AzureWebJobsStorage")]string message,
            [SignalR(HubName = "dqcdevsummit")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            message = FixJson(message);
            
            var tweet = JsonConvert.DeserializeObject<Tweet>(message);

            return signalRMessages.AddAsync(
          new SignalRMessage
          {
              Target = "tweet",
              Arguments = new[] { tweet }
          });


        }

        static string FixJson(string input)
        {
            var output = input;
            for (var x = 0; x < input.Length; x++)
            {
                if (input[x] != '\"') continue;

                for (var y = x + 1; y < input.Length; y++)
                {
                    if (input[y] != '\"') continue;

                    var found = false;
                    for (var z = y + 1; z < input.Length; z++)
                    {
                        if (input[z] != '\"') continue;

                        var tmp = input.Substring(y + 1, z - y - 1);
                        if (tmp.Any(t => t != ' ' && t != ':' && t != ',' && t != '{' && t != '}'))
                        {
                            output = output.Replace("\"" + tmp + "\"", "\\\"" + tmp + "\\\"");
                        }

                        x = y;
                        found = true;
                        break;
                    }

                    if (found)
                        break;
                }
            }

            return output;
        }
    }
}

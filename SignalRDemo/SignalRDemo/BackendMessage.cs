using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace SignalRDemo
{
    public static class BackendMessage
    {
        [FunctionName("BackendMessage")]
        public static Task Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] object message,
            [SignalR(HubName = "dqcdevsummit")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            return signalRMessages.AddAsync(
              new SignalRMessage
              {
                  Target = "newMessage",
                  Arguments = new[] { new { sender = "david", text = "from backend", Foo = "Bar" } }
              });
        }
    }
}

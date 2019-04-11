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
    public static class GetSignalRInfo
    {
        [FunctionName("negotiate")]
        public static SignalRConnectionInfo Get(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "dqcdevsummit")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }
    }
}

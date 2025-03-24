# TTS Web Replatform

## About this Solution
This solution is implemented using Sitecore XMC Containers, the Sitecore Next.js SDK, Sitecore Content Serialization and Ordercloud.

## Prerequisites
* NodeJs 18.x
* .NET 6.0 SDK
* .NET Framework 4.8 SDK
* Visual Studio 2022 with Docker Support
* Docker for Windows, with Windows Containers enabled

## Running this Solution
1. If your local IIS is listening on port 443, you'll need to stop it.
   > This requires an elevated permissions in PowerShell or command prompt.
   ```
   iisreset /stop
   ```
   
2. Enable Windows Feature for Windows Containers
   > This requires an elevated permissions in PowerShell
   ```
   Enable-WindowsOptionalFeature -Online -FeatureName $(“Microsoft-Hyper-V”, “Containers”) -all
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass
   ```
   Restart your system after this.

3. Now start Docker Desktop.
4. Right click docker icon in the right bottom panel, select "Switch to Windows containers".
5. Go to `src\Project\rendering` and open the command prompt and run the following command:
    ```
    npm i
    ```

6. Open powershell in the root folder and run the following commands :

    ```ps1
    .\init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"
    ```

7. Restart your terminal and run:

    ```ps1
    .\up.ps1
    ```

8. When prompted, log into Sitecore via your browser, and accept the device authorization.

*** 


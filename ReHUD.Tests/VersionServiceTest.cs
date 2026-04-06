using Xunit;
using ReHUD.Services;

namespace ReHUD.Tests;

public class VersionServiceTest
{
    [Fact]
    public void TrimVersion_ParsesStandardVersion()
    {
        var result = VersionService.TrimVersion("0.11.5");
        Assert.Equal(new Version(0, 11, 5), result);
    }

    [Fact]
    public void TrimVersion_StripsBetaSuffix()
    {
        var result = VersionService.TrimVersion("0.11.5-beta");
        Assert.Equal(new Version(0, 11, 5), result);
    }

    [Fact]
    public void TrimVersion_StripsVPrefix()
    {
        var result = VersionService.TrimVersion("v0.11.5");
        Assert.Equal(new Version(0, 11, 5), result);
    }

    [Fact]
    public void TrimVersion_ReturnsDefaultForNull()
    {
        var result = VersionService.TrimVersion(null);
        Assert.Equal(VersionService.DEFAULT_VERSION, result);
    }

    [Fact]
    public void ReadVersionFromManifest_ReturnsBuiltVersion()
    {
        var tempFile = Path.GetTempFileName();
        File.WriteAllText(tempFile, @"{
            ""build"": {
                ""buildVersion"": ""0.11.5-beta""
            }
        }");
        try
        {
            var version = VersionService.ReadVersionFromManifest(tempFile);
            Assert.Equal("0.11.5-beta", version);
        }
        finally
        {
            File.Delete(tempFile);
        }
    }

    [Fact]
    public void ReadVersionFromManifest_ReturnsNullWhenFileMissing()
    {
        var version = VersionService.ReadVersionFromManifest("/nonexistent/path.json");
        Assert.Null(version);
    }

    [Fact]
    public void ReadVersionFromManifest_ReturnsNullWhenNoBuildVersion()
    {
        var tempFile = Path.GetTempFileName();
        File.WriteAllText(tempFile, @"{ ""name"": ""test"" }");
        try
        {
            var version = VersionService.ReadVersionFromManifest(tempFile);
            Assert.Null(version);
        }
        finally
        {
            File.Delete(tempFile);
        }
    }
}

using Xunit;
using ReHUD.Services;

namespace ReHUD.Tests;

public class ConsumptionCalcTest
{
    // --- CalcFuelDiff ---

    [Fact]
    public void CalcFuelDiff_ReturnsConsumption()
    {
        var diff = R3EDataService.CalcFuelDiff(50f, 47f);
        Assert.Equal(3f, diff);
    }

    [Fact]
    public void CalcFuelDiff_ReturnsNullWhenLastFuelNull()
    {
        Assert.Null(R3EDataService.CalcFuelDiff(null, 47f));
    }

    [Fact]
    public void CalcFuelDiff_ReturnsNullWhenFuelNowNull()
    {
        Assert.Null(R3EDataService.CalcFuelDiff(50f, null));
    }

    [Fact]
    public void CalcFuelDiff_ReturnsNullWhenFuelNowIsInvalid()
    {
        Assert.Null(R3EDataService.CalcFuelDiff(50f, -1f));
    }

    [Fact]
    public void CalcFuelDiff_HandlesRefuel()
    {
        // After pit stop: fuelNow > lastFuel → negative diff
        var diff = R3EDataService.CalcFuelDiff(10f, 50f);
        Assert.Equal(-40f, diff);
    }

    // --- CalcVirtualEnergyDiff ---

    [Fact]
    public void CalcVirtualEnergyDiff_ReturnsConsumption()
    {
        var diff = R3EDataService.CalcVirtualEnergyDiff(8.5f, 7.2f);
        Assert.NotNull(diff);
        Assert.Equal(1.3f, diff!.Value, 2);
    }

    [Fact]
    public void CalcVirtualEnergyDiff_ReturnsNullWhenLastNull()
    {
        Assert.Null(R3EDataService.CalcVirtualEnergyDiff(null, 7.2f));
    }

    [Fact]
    public void CalcVirtualEnergyDiff_ReturnsNullWhenCurrentNull()
    {
        Assert.Null(R3EDataService.CalcVirtualEnergyDiff(8.5f, null));
    }

    [Fact]
    public void CalcVirtualEnergyDiff_NegativeWhenRegenerated()
    {
        // Energy regenerated: current > last → negative diff
        var diff = R3EDataService.CalcVirtualEnergyDiff(5f, 7f);
        Assert.Equal(-2f, diff);
    }

    // --- ShouldSaveVirtualEnergy ---

    [Fact]
    public void ShouldSaveVE_TrueWhenPositive()
    {
        Assert.True(R3EDataService.ShouldSaveVirtualEnergy(1.3f));
    }

    [Fact]
    public void ShouldSaveVE_FalseWhenNull()
    {
        Assert.False(R3EDataService.ShouldSaveVirtualEnergy(null));
    }

    [Fact]
    public void ShouldSaveVE_FalseWhenZero()
    {
        Assert.False(R3EDataService.ShouldSaveVirtualEnergy(0f));
    }

    [Fact]
    public void ShouldSaveVE_FalseWhenNegative()
    {
        // Regeneration should not be saved as consumption
        Assert.False(R3EDataService.ShouldSaveVirtualEnergy(-2f));
    }
}

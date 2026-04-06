import HudElement, {Hide} from "./HudElement.js";
import {valuesAreValid, NA, lerpRGB} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyLastLap extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyCapacity', '+virtualEnergyLastLap', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyCapacity: number, virtualEnergyLastLap: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valuesAreValid(virtualEnergyLastLap, virtualEnergyPerLap, virtualEnergyCapacity) || virtualEnergyCapacity === 0) {
      this.root.style.setProperty('--virtual-energy-last-lap-color', 'var(--fuel-middle-color)');
      return NA;
    }

    // Last lap consumed more than average → red, less → green (same logic as FuelLastLap)
    // Color uses raw MJ values — relative comparison is the same regardless of units
    this.root.style.setProperty('--virtual-energy-last-lap-color', lerpRGB([255, 0, 0], [0, 255, 0], (virtualEnergyPerLap - virtualEnergyLastLap) * 2.5 + 0.5));
    const percent = (virtualEnergyLastLap / virtualEnergyCapacity) * 100;
    return `${percent.toFixed(2)}`;
  }
}

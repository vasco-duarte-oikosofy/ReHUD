import HudElement, {Hide} from "./HudElement.js";
import {valuesAreValid, NA, lerpRGB} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyLastLap extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', '+virtualEnergyLastLap', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyLastLap: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valuesAreValid(virtualEnergyLastLap, virtualEnergyPerLap)) {
      this.root.style.setProperty('--virtual-energy-last-lap-color', 'var(--fuel-middle-color)');
      return NA;
    }

    // Last lap consumed more than average → red, less → green (same logic as FuelLastLap)
    this.root.style.setProperty('--virtual-energy-last-lap-color', lerpRGB([255, 0, 0], [0, 255, 0], (virtualEnergyPerLap - virtualEnergyLastLap) * 2.5 + 0.5));
    return `${virtualEnergyLastLap.toFixed(2)}`;
  }
}

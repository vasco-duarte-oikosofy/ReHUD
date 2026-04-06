import HudElement, {Hide} from "./HudElement.js";
import {valuesAreValid, NA, lerpRGB} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyToAdd extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyLeft', 'virtualEnergyCapacity', '+lapsUntilFinish', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyLeft: number, virtualEnergyCapacity: number, lapsUntilFinish: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valuesAreValid(lapsUntilFinish, virtualEnergyLeft, virtualEnergyPerLap, virtualEnergyCapacity) || virtualEnergyCapacity === 0) {
      this.root.style.setProperty('--virtual-energy-to-add-color', 'var(--fuel-middle-color)');
      return NA;
    }
    const needed = lapsUntilFinish * virtualEnergyPerLap;
    const deficit = Math.max(0, needed - virtualEnergyLeft);
    const percent = (deficit / virtualEnergyCapacity) * 100;
    // Green when no deficit, red when large deficit (same pattern as FuelToAdd)
    this.root.style.setProperty('--virtual-energy-to-add-color', lerpRGB([0, 255, 0], [255, 0, 0], percent / 20));
    return `${percent.toFixed(1)}%`;
  }
}

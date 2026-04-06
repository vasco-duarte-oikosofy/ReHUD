import HudElement, {Hide} from "./HudElement.js";
import {valueIsValidAssertUndefined, NA, lerpRGB} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyLapsLeft extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyLeft', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyLeft: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valueIsValidAssertUndefined(virtualEnergyLeft) || !valueIsValidAssertUndefined(virtualEnergyPerLap) || virtualEnergyPerLap === 0) {
      this.root.style.setProperty('--virtual-energy-left-color', 'rgb(0, 255, 0)');
      return NA;
    }

    const lapsLeft = virtualEnergyLeft / virtualEnergyPerLap;
    // Color gradient: red (1 lap) to green (5+ laps), same as FuelLapsLeft
    this.root.style.setProperty('--virtual-energy-left-color', lerpRGB([255, 0, 0], [0, 255, 0], (lapsLeft - 1) / 4));
    return `${lapsLeft.toFixed(1)}`;
  }
}

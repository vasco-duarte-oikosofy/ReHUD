import HudElement, {Hide} from "./HudElement.js";
import {valueIsValidAssertUndefined, NA} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyPerLap extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyCapacity', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyCapacity: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valueIsValidAssertUndefined(virtualEnergyPerLap) || !valueIsValidAssertUndefined(virtualEnergyCapacity) || virtualEnergyCapacity === 0) {
      return NA;
    }
    const percent = (virtualEnergyPerLap / virtualEnergyCapacity) * 100;
    return `${percent.toFixed(2)}`;
  }
}

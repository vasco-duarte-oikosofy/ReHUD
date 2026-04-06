import HudElement, {Hide} from "./HudElement.js";
import {valueIsValidAssertUndefined, NA} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyLeft extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyLeft', 'virtualEnergyCapacity'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyLeft: number, virtualEnergyCapacity: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valueIsValidAssertUndefined(virtualEnergyLeft) || !valueIsValidAssertUndefined(virtualEnergyCapacity) || virtualEnergyCapacity === 0) {
      return NA;
    }
    const percent = (virtualEnergyLeft / virtualEnergyCapacity) * 100;
    return `${percent.toFixed(1)}%`;
  }
}

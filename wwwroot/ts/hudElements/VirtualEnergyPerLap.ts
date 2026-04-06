import HudElement, {Hide} from "./HudElement.js";
import {valueIsValidAssertUndefined, NA} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyPerLap extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    return valueIsValidAssertUndefined(virtualEnergyPerLap) ? `${virtualEnergyPerLap.toFixed(2)}` : NA;
  }
}
